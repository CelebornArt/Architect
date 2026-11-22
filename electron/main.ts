import { app, BrowserWindow, dialog, ipcMain, Menu, net, protocol, shell } from 'electron';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import { createWriteStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_FILE = path.join(__dirname, '..', 'index.html');
const DEFAULT_UPDATE_FEED_URL = 'https://api.github.com/repos/CelebornArt/Architect/releases/latest';
const pageWindows = new Set<BrowserWindow>();
const writeQueues = new Map<string, Promise<void>>();
let updateInstallInProgress = false;

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'architect-asset',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
]);

function dataRoot(): string {
  return path.join(app.getPath('userData'), 'ArchitectData');
}

function assetsDir(): string {
  return path.join(dataRoot(), 'assets');
}

function previewsDir(): string {
  return path.join(dataRoot(), 'previews');
}

function remoteCacheDir(): string {
  return path.join(dataRoot(), 'remote-cache');
}

function formUploadsBaseDir(): string {
  return path.join(dataRoot(), 'form-uploads');
}

async function ensureStorageDirs(): Promise<void> {
  await fs.mkdir(dataRoot(), { recursive: true });
  await fs.mkdir(assetsDir(), { recursive: true });
  await fs.mkdir(previewsDir(), { recursive: true });
  await fs.mkdir(remoteCacheDir(), { recursive: true });
  await fs.mkdir(formUploadsBaseDir(), { recursive: true });
}

function atomicWriteFile(filePath: string, data: string | Buffer): Promise<void> {
  const prev = writeQueues.get(filePath) || Promise.resolve();
  const next = prev.catch(() => {}).then(async () => {
    const temp = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(temp, data);
    await fs.rename(temp, filePath);
  });
  writeQueues.set(filePath, next);
  return next;
}

function safeIdSegment(raw: string): string {
  return String(raw || '').replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'asset';
}

function fallbackExtForMime(mimeType: string): string {
  const map: Record<string, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/ogg': '.ogg',
    'audio/flac': '.flac',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
    'model/gltf-binary': '.glb',
    'model/gltf+json': '.gltf',
    'application/pdf': '.pdf'
  };
  return map[(mimeType || '').toLowerCase()] || '';
}

function resolveInside(baseDir: string, fileName: string): string | null {
  const clean = path.basename(String(fileName || ''));
  if (!clean || clean === '.' || clean === '..') return null;
  const base = path.resolve(baseDir);
  const candidate = path.resolve(base, clean);
  return candidate.startsWith(base + path.sep) ? candidate : null;
}

async function copyMissingFiles(srcDir: string, destDir: string): Promise<void> {
  if (!existsSync(srcDir)) return;
  await fs.mkdir(destDir, { recursive: true });
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const srcFile = resolveInside(srcDir, entry.name);
    const dstFile = resolveInside(destDir, entry.name);
    if (srcFile && dstFile && !existsSync(dstFile)) {
      await fs.copyFile(srcFile, dstFile);
    }
  }
}

function windowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 560,
    title: 'Architect',
    backgroundColor: '#ffffff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  };
}

function isPageDeepLink(url: string): boolean {
  try {
    const target = new URL(url);
    if (target.protocol !== 'file:') return false;
    if (!target.hash.startsWith('#page=')) return false;
    return path.normalize(fileURLToPath(target)) === path.normalize(APP_FILE);
  } catch {
    return false;
  }
}

function openPageWindow(url: string): void {
  const pageWindow = new BrowserWindow(windowOptions());
  pageWindows.add(pageWindow);
  pageWindow.on('closed', () => pageWindows.delete(pageWindow));
  wireWindow(pageWindow);
  void pageWindow.loadURL(url);
}

function wireWindow(window: BrowserWindow): void {
  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      void shell.openExternal(url);
      return { action: 'deny' };
    }
    if (isPageDeepLink(url)) {
      openPageWindow(url);
      return { action: 'deny' };
    }
    return { action: 'deny' };
  });
}

function createWindow(): void {
  const window = new BrowserWindow(windowOptions());
  wireWindow(window);
  void window.loadFile(APP_FILE);
}

function updateAuthPath(): string {
  return path.join(dataRoot(), 'update-auth.json');
}

async function readUpdateAuth(): Promise<{ token?: string; autoCheck: boolean }> {
  try {
    const raw = await fs.readFile(updateAuthPath(), 'utf8');
    const parsed = JSON.parse(raw);
    return {
      token: typeof parsed?.token === 'string' && parsed.token.trim() ? parsed.token.trim() : undefined,
      autoCheck: parsed?.autoCheck !== false
    };
  } catch {
    return { autoCheck: true };
  }
}

async function writeUpdateAuth(next: { token?: string; autoCheck?: boolean }): Promise<{ hasToken: boolean; autoCheck: boolean }> {
  await ensureStorageDirs();
  const payload: { token?: string; autoCheck: boolean } = {
    autoCheck: next.autoCheck !== false
  };
  if (typeof next.token === 'string' && next.token.trim()) {
    payload.token = next.token.trim();
  }
  await atomicWriteFile(updateAuthPath(), JSON.stringify(payload, null, 2));
  return { hasToken: Boolean(payload.token), autoCheck: payload.autoCheck };
}

function compareSemverMain(a: string, b: string): number {
  const pa = String(a || '').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const pb = String(b || '').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0) ? 1 : -1;
  }
  return 0;
}

function isAllowedUpdateUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(String(rawUrl || '').trim());
    if (parsed.protocol === 'https:') return true;
    return parsed.protocol === 'http:' && (parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost');
  } catch {
    return false;
  }
}

function shouldAttachToken(targetUrl: string, feedOrigin?: string): boolean {
  try {
    const parsed = new URL(targetUrl);
    if (parsed.hostname === 'api.github.com' || parsed.hostname === 'github.com' || parsed.hostname.endsWith('.github.com')) {
      return true;
    }
    return Boolean(feedOrigin && parsed.origin === feedOrigin);
  } catch {
    return false;
  }
}

async function fetchWithOptionalAuth(targetUrl: string, token?: string, accept = 'application/json', feedOrigin?: string): Promise<Response> {
  if (!isAllowedUpdateUrl(targetUrl)) throw new Error('Blocked insecure or invalid update URL');
  const headers: Record<string, string> = {
    Accept: accept,
    'User-Agent': `Architect/${app.getVersion()}`
  };
  const sendToken = Boolean(token && shouldAttachToken(targetUrl, feedOrigin));
  if (sendToken) {
    headers.Authorization = `Bearer ${token}`;
    headers['X-GitHub-Api-Version'] = '2022-11-28';
  }
  const resp = await net.fetch(targetUrl, { headers, redirect: 'manual' });
  if (resp.status >= 300 && resp.status < 400) {
    const loc = resp.headers.get('location');
    if (!loc) throw new Error(`Redirect without Location from update host (${resp.status})`);
    const resolvedLoc = new URL(loc, targetUrl).toString();
    if (!isAllowedUpdateUrl(resolvedLoc)) throw new Error('Blocked redirect to insecure update host');
    const sameHost = new URL(resolvedLoc).origin === new URL(targetUrl).origin;
    const redirHeaders: Record<string, string> = {
      Accept: accept,
      'User-Agent': `Architect/${app.getVersion()}`
    };
    if (sameHost && sendToken && token) {
      redirHeaders.Authorization = `Bearer ${token}`;
    }
    return net.fetch(resolvedLoc, { headers: redirHeaders });
  }
  return resp;
}

function pickReleaseInstallerAsset(assets: any[], isPortable: boolean, platform: string): {
  asset: any | null;
  installKind: 'nsis' | 'portable' | 'exe' | 'mac' | 'unknown';
  latestYmlAsset: any | null;
} {
  const list = Array.isArray(assets) ? assets.filter(a => a && typeof a.name === 'string') : [];
  const latestYmlAsset = list.find(a => a.name.toLowerCase() === 'latest.yml') || null;
  if (platform === 'win32') {
    const exeAssets = list.filter(a => /\.exe$/i.test(a.name) && !/\.blockmap$/i.test(a.name));
    const setupAsset = exeAssets.find(a => /setup/i.test(a.name)) || null;
    const portableAsset = exeAssets.find(a => !/setup|uninstall/i.test(a.name)) || null;
    if (isPortable && portableAsset) return { asset: portableAsset, installKind: 'portable', latestYmlAsset };
    if (!isPortable && setupAsset) return { asset: setupAsset, installKind: 'nsis', latestYmlAsset };
    if (setupAsset) return { asset: setupAsset, installKind: 'nsis', latestYmlAsset };
    if (portableAsset) return { asset: portableAsset, installKind: isPortable ? 'portable' : 'exe', latestYmlAsset };
    return { asset: exeAssets[0] || null, installKind: exeAssets[0] ? 'exe' : 'unknown', latestYmlAsset };
  }
  if (platform === 'darwin') {
    const macAsset = list.find(a => /\.(dmg|zip)$/i.test(a.name)) || null;
    return { asset: macAsset, installKind: macAsset ? 'mac' : 'unknown', latestYmlAsset };
  }
  return { asset: null, installKind: 'unknown', latestYmlAsset };
}

function normalizeAssetKey(name: string): string {
  return String(name || '').trim().replace(/[\s.]+/g, '-').toLowerCase();
}

function parseLatestYmlSha512(ymlText: string, assetName: string): string | null {
  if (!ymlText || !assetName) return null;
  const targetNorm = normalizeAssetKey(assetName);
  const lines = ymlText.split(/\r?\n/);
  let currentUrlOrPath = '';
  for (const rawLine of lines) {
    const urlMatch = rawLine.match(/^\s*(?:-\s*)?(?:url|path):\s*['"]?([^'"\r\n]+)['"]?/i);
    if (urlMatch) {
      currentUrlOrPath = urlMatch[1].trim();
      continue;
    }
    const shaMatch = rawLine.match(/^\s*sha512:\s*['"]?([A-Za-z0-9+/=]+)['"]?/i);
    if (shaMatch && currentUrlOrPath && normalizeAssetKey(currentUrlOrPath) === targetNorm) {
      return shaMatch[1].trim();
    }
  }
  return null;
}

async function hashFile(filePath: string, algorithm: 'sha256' | 'sha512'): Promise<Buffer> {
  const hash = crypto.createHash(algorithm);
  const fh = await fs.open(filePath, 'r');
  try {
    const buf = Buffer.allocUnsafe(256 * 1024);
    while (true) {
      const { bytesRead } = await fh.read(buf, 0, buf.length, null);
      if (bytesRead === 0) break;
      hash.update(bytesRead === buf.length ? buf : buf.subarray(0, bytesRead));
    }
    return hash.digest();
  } finally {
    await fh.close();
  }
}

async function streamResponseToFile(resp: Response, destPath: string, expectedBytes: number, onProgress: (downloaded: number, total: number) => void): Promise<number> {
  const total = expectedBytes || Number(resp.headers.get('content-length') || 0) || 0;
  if (!resp.body) {
    const ab = await resp.arrayBuffer();
    const buf = Buffer.from(ab);
    await fs.writeFile(destPath, buf);
    onProgress(buf.byteLength, total || buf.byteLength);
    return buf.byteLength;
  }
  const reader = resp.body.getReader();
  const ws = createWriteStream(destPath);
  let downloaded = 0;
  let lastEmit = 0;
  try {
    await new Promise<void>((resolve, reject) => {
      ws.on('error', reject);
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              ws.end(() => resolve());
              return;
            }
            if (value && value.byteLength) {
              downloaded += value.byteLength;
              if (!ws.write(Buffer.from(value.buffer, value.byteOffset, value.byteLength))) {
                await new Promise<void>(resDrain => ws.once('drain', resDrain));
              }
              const now = Date.now();
              if (now - lastEmit >= 120 || downloaded === total) {
                lastEmit = now;
                onProgress(downloaded, total);
              }
            }
          }
        } catch (err) {
          reject(err);
        }
      };
      void pump();
    });
  } catch (err) {
    try { ws.destroy(); } catch {}
    throw err;
  }
  onProgress(downloaded, total || downloaded);
  return downloaded;
}

async function launchDownloadedUpdate(filePath: string, installKind: string): Promise<'nsis' | 'portable' | 'shell'> {
  const portableTarget = String(process.env.PORTABLE_EXECUTABLE_FILE || '').trim();
  if (process.platform === 'win32' && portableTarget && installKind === 'portable') {
    const updateDir = path.dirname(filePath);
    const swapScript = path.join(updateDir, 'apply-portable-update.ps1');
    const psBody = [
      'param([int]$OldPid, [string]$SourceExe, [string]$TargetExe)',
      '$deadline = (Get-Date).AddSeconds(20)',
      'while ((Get-Date) -lt $deadline) {',
      '  if (-not (Get-Process -Id $OldPid -ErrorAction SilentlyContinue)) { break }',
      '  Start-Sleep -Milliseconds 250',
      '}',
      'Start-Sleep -Milliseconds 200',
      'for ($i = 0; $i -lt 15; $i++) {',
      '  try {',
      '    Move-Item -LiteralPath $SourceExe -Destination $TargetExe -Force',
      '    break',
      '  } catch {',
      '    Start-Sleep -Milliseconds 300',
      '  }',
      '}',
      'if (Test-Path -LiteralPath $TargetExe) { Start-Process -FilePath $TargetExe }',
      'Remove-Item -LiteralPath $PSCommandPath -Force -ErrorAction SilentlyContinue'
    ].join('\r\n');
    await fs.writeFile(swapScript, psBody, 'utf8');
    const child = spawn('powershell.exe', [
      '-NoProfile',
      '-ExecutionPolicy', 'Bypass',
      '-WindowStyle', 'Hidden',
      '-File', swapScript,
      '-OldPid', String(process.pid),
      '-SourceExe', filePath,
      '-TargetExe', portableTarget
    ], { detached: true, stdio: 'ignore', windowsHide: true });
    child.unref();
    return 'portable';
  }
  if (process.platform === 'win32' && /\.exe$/i.test(filePath)) {
    const args = installKind === 'nsis' ? ['--updated', '/S', '--force-run'] : [];
    const child = spawn(filePath, args, {
      detached: true,
      stdio: 'ignore',
      windowsHide: installKind === 'nsis'
    });
    child.unref();
    return 'nsis';
  }
  const errStr = await shell.openPath(filePath);
  if (errStr) throw new Error(errStr);
  return 'shell';
}

function registerStorageIpc(): void {
  ipcMain.handle('architect:info', async () => {
    await ensureStorageDirs();
    return { dataDir: dataRoot(), platform: process.platform, version: app.getVersion() };
  });

  ipcMain.handle('architect:get-update-config', async () => {
    const auth = await readUpdateAuth();
    return {
      defaultFeedUrl: DEFAULT_UPDATE_FEED_URL,
      hasToken: Boolean(auth.token),
      autoCheck: auth.autoCheck
    };
  });

  ipcMain.handle('architect:set-update-config', async (_event, cfg: { token?: string; clearToken?: boolean; autoCheck?: boolean }) => {
    const existing = await readUpdateAuth();
    const nextToken = cfg?.clearToken
      ? undefined
      : typeof cfg?.token === 'string'
        ? (cfg.token.trim() || existing.token)
        : existing.token;
    const nextAutoCheck = typeof cfg?.autoCheck === 'boolean' ? cfg.autoCheck : existing.autoCheck;
    const saved = await writeUpdateAuth({ token: nextToken, autoCheck: nextAutoCheck });
    return { ok: true, ...saved };
  });

  ipcMain.handle('architect:check-update', async (_event, feedUrl?: string) => {
    const currentVersion = app.getVersion();
    const cleanUrl = String(feedUrl || DEFAULT_UPDATE_FEED_URL).trim();
    if (!isAllowedUpdateUrl(cleanUrl)) {
      return { currentVersion, updateAvailable: false, error: 'Update feed URL must use https://' };
    }
    const auth = await readUpdateAuth();
    const feedOrigin = new URL(cleanUrl).origin;
    try {
      const resp = await fetchWithOptionalAuth(cleanUrl, auth.token, 'application/vnd.github+json, application/json', feedOrigin);
      if (resp.status === 404 || resp.status === 401 || resp.status === 403) {
        const isGhApi = new URL(cleanUrl).hostname === 'api.github.com';
        return {
          currentVersion,
          updateAvailable: false,
          requiresAuth: isGhApi,
          error: isGhApi
            ? `GitHub returned HTTP ${resp.status} (no public release found, or repo is private — add a read-only GitHub token in Settings)`
            : `HTTP ${resp.status}`
        };
      }
      if (!resp.ok) return { currentVersion, updateAvailable: false, error: `HTTP ${resp.status}` };
      const data: any = await resp.json();
      const latestVersion = String(data?.tag_name || data?.version || '').replace(/^v/i, '').trim();
      const downloadUrl = String(data?.html_url || data?.downloadUrl || data?.url || '');
      const notes = String(data?.body || data?.notes || '');
      const isPortable = Boolean(process.env.PORTABLE_EXECUTABLE_FILE);
      const { asset, installKind, latestYmlAsset } = pickReleaseInstallerAsset(data?.assets, isPortable, process.platform);
      const installerUrl = String(asset?.browser_download_url || data?.installerUrl || '');
      const installerApiUrl = String(asset?.url || '');
      const digestRaw = String(asset?.digest || '');
      const assetSha256 = /^sha256:([a-f0-9]{64})$/i.test(digestRaw) ? digestRaw.slice(7).toLowerCase() : '';
      return {
        currentVersion,
        latestVersion,
        version: latestVersion,
        downloadUrl,
        installerUrl,
        installerApiUrl,
        assetName: String(asset?.name || data?.assetName || ''),
        assetSize: Number(asset?.size || 0) || 0,
        assetSha256,
        latestYmlUrl: String(latestYmlAsset?.browser_download_url || ''),
        latestYmlApiUrl: String(latestYmlAsset?.url || ''),
        installKind,
        notes,
        updateAvailable: Boolean(latestVersion && compareSemverMain(latestVersion, currentVersion) > 0)
      };
    } catch (error) {
      return { currentVersion, updateAvailable: false, error: error instanceof Error ? error.message : 'Update check failed' };
    }
  });

  ipcMain.handle('architect:install-update', async (event, payload: {
    url: string;
    apiUrl?: string;
    assetName: string;
    expectedSize?: number;
    sha256?: string;
    latestYmlUrl?: string;
    latestYmlApiUrl?: string;
    installKind?: string;
  }) => {
    if (updateInstallInProgress) {
      return { ok: false, error: 'An update installation is already in progress' };
    }
    updateInstallInProgress = true;
    const sendProgress = (progress: { phase: string; percent?: number; downloadedBytes?: number; totalBytes?: number; message?: string }) => {
      try {
        if (!event.sender.isDestroyed()) event.sender.send('architect:update-progress', progress);
      } catch {}
    };
    let destPath = '';
    try {
      const auth = await readUpdateAuth();
      const preferApi = Boolean(auth.token && payload.apiUrl && isAllowedUpdateUrl(payload.apiUrl) && shouldAttachToken(payload.apiUrl));
      const downloadSource = preferApi ? String(payload.apiUrl) : String(payload.url || payload.apiUrl || '').trim();
      if (!isAllowedUpdateUrl(downloadSource)) throw new Error('Invalid installer download URL');

      const updateDir = path.join(app.getPath('temp'), 'ArchitectUpdate');
      await fs.mkdir(updateDir, { recursive: true });
      const fileName = safeIdSegment(path.basename(payload.assetName || 'Architect-Update.exe'));
      destPath = path.join(updateDir, fileName);
      if (existsSync(destPath)) await fs.unlink(destPath).catch(() => {});

      sendProgress({ phase: 'downloading', percent: 0, downloadedBytes: 0, totalBytes: payload.expectedSize || 0, message: 'Downloading update…' });
      const resp = await fetchWithOptionalAuth(
        downloadSource,
        auth.token,
        preferApi ? 'application/octet-stream' : '*/*'
      );
      if (!resp.ok) throw new Error(`Download failed (HTTP ${resp.status})`);

      const downloadedBytes = await streamResponseToFile(resp, destPath, Number(payload.expectedSize || 0), (dl, total) => {
        const pct = total > 0 ? Math.min(99, Math.round((dl / total) * 100)) : 0;
        sendProgress({ phase: 'downloading', percent: pct, downloadedBytes: dl, totalBytes: total });
      });

      sendProgress({ phase: 'verifying', percent: 100, downloadedBytes, totalBytes: downloadedBytes, message: 'Verifying download…' });
      if (downloadedBytes <= 0 || (payload.expectedSize && payload.expectedSize > 0 && downloadedBytes !== payload.expectedSize)) {
        throw new Error('Downloaded installer size does not match release metadata');
      }
      if (payload.sha256 && /^[a-f0-9]{64}$/i.test(payload.sha256)) {
        const actualSha256 = (await hashFile(destPath, 'sha256')).toString('hex');
        if (actualSha256.toLowerCase() !== payload.sha256.toLowerCase()) {
          throw new Error('SHA-256 checksum mismatch — aborted update');
        }
      }
      const ymlSource = auth.token && payload.latestYmlApiUrl ? payload.latestYmlApiUrl : (payload.latestYmlUrl || '');
      if (ymlSource && isAllowedUpdateUrl(ymlSource)) {
        const ymlResp = await fetchWithOptionalAuth(
          ymlSource,
          auth.token,
          auth.token && payload.latestYmlApiUrl ? 'application/octet-stream' : 'text/yaml, text/plain, */*'
        );
        if (ymlResp.ok) {
          const ymlText = await ymlResp.text();
          const expectedSha512 = parseLatestYmlSha512(ymlText, payload.assetName);
          if (expectedSha512) {
            const actualSha512 = (await hashFile(destPath, 'sha512')).toString('base64');
            if (actualSha512 !== expectedSha512) {
              throw new Error('SHA-512 checksum mismatch against latest.yml — aborted update');
            }
          }
        }
      }

      sendProgress({ phase: 'installing', percent: 100, downloadedBytes, totalBytes: downloadedBytes, message: 'Installing update and restarting…' });
      const mode = await launchDownloadedUpdate(destPath, String(payload.installKind || 'nsis'));
      setTimeout(() => app.quit(), 180);
      return { ok: true, mode, filePath: destPath };
    } catch (error) {
      if (destPath && existsSync(destPath)) await fs.unlink(destPath).catch(() => {});
      const message = error instanceof Error ? error.message : 'Update installation failed';
      sendProgress({ phase: 'error', message });
      return { ok: false, error: message };
    } finally {
      updateInstallInProgress = false;
    }
  });

  ipcMain.handle('architect:relaunch', async () => {
    app.relaunch();
    app.exit(0);
    return { ok: true };
  });

  ipcMain.handle('architect:read-workspace', async () => {
    await ensureStorageDirs();
    const target = path.join(dataRoot(), 'workspace.json');
    const backup = path.join(dataRoot(), 'workspace.bak.json');
    const tryReadValid = async (p: string) => {
      if (!existsSync(p)) return null;
      const raw = await fs.readFile(p, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 2 && Array.isArray(parsed.pages) && parsed.pages.length > 0) return raw;
      return null;
    };
    try {
      const primary = await tryReadValid(target);
      if (primary) return primary;
    } catch {}
    try {
      const bak = await tryReadValid(backup);
      if (bak) return bak;
    } catch {}
    return existsSync(target) ? fs.readFile(target, 'utf8').catch(() => null) : null;
  });

  ipcMain.handle('architect:write-workspace', async (_event, json: string) => {
    if (typeof json !== 'string' || json.length > 50_000_000) throw new Error('Invalid workspace payload');
    let parsedNew: any;
    try {
      parsedNew = JSON.parse(json);
    } catch {
      throw new Error('Malformed workspace JSON');
    }
    if (!parsedNew || parsedNew.version !== 2 || !Array.isArray(parsedNew.pages) || parsedNew.pages.length === 0) {
      throw new Error('Refusing to persist empty workspace payload');
    }
    await ensureStorageDirs();
    const target = path.join(dataRoot(), 'workspace.json');
    const backup = path.join(dataRoot(), 'workspace.bak.json');
    if (existsSync(target)) {
      try {
        const prevRaw = await fs.readFile(target, 'utf8');
        const prev = JSON.parse(prevRaw);
        if (prev?.version === 2 && Array.isArray(prev.pages) && prev.pages.length > 0) {
          await atomicWriteFile(backup, prevRaw);
        }
      } catch {}
    }
    await atomicWriteFile(target, json);
    return { ok: true };
  });

  ipcMain.handle('architect:read-assets', async () => {
    await ensureStorageDirs();
    const target = path.join(dataRoot(), 'assets.json');
    if (!existsSync(target)) return null;
    return fs.readFile(target, 'utf8');
  });

  ipcMain.handle('architect:write-assets', async (_event, json: string) => {
    if (typeof json !== 'string' || json.length > 50_000_000) throw new Error('Invalid asset catalog payload');
    await ensureStorageDirs();
    await atomicWriteFile(path.join(dataRoot(), 'assets.json'), json);
    return { ok: true };
  });

  ipcMain.handle('architect:save-asset', async (_event, payload: {
    id: string;
    name: string;
    mimeType: string;
    base64: string;
    previewBase64?: string;
    previewMimeType?: string;
  }) => {
    await ensureStorageDirs();
    const cleanId = safeIdSegment(payload.id);
    const rawExt = path.extname(payload.name || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 12);
    const ext = rawExt || fallbackExtForMime(payload.mimeType);
    const fileName = `${cleanId}${ext}`;
    const fullPath = resolveInside(assetsDir(), fileName);
    if (!fullPath) throw new Error('Invalid asset path');
    const bytes = Buffer.from(payload.base64, 'base64');
    await atomicWriteFile(fullPath, bytes);
    let previewName: string | undefined;
    if (payload.previewBase64) {
      const prevExt = fallbackExtForMime(payload.previewMimeType || 'image/webp') || '.png';
      previewName = `${cleanId}-preview${prevExt}`;
      const prevPath = resolveInside(previewsDir(), previewName);
      if (prevPath) await atomicWriteFile(prevPath, Buffer.from(payload.previewBase64, 'base64'));
    }
    return {
      ok: true,
      fileName,
      previewName,
      sizeBytes: bytes.byteLength,
      originalUrl: `architect-asset://files/${encodeURIComponent(fileName)}`,
      previewUrl: previewName ? `architect-asset://previews/${encodeURIComponent(previewName)}` : undefined
    };
  });

  ipcMain.handle('architect:save-form-upload', async (_event, payload: {
    id: string;
    folder?: string;
    name: string;
    mimeType: string;
    base64: string;
  }) => {
    await ensureStorageDirs();
    const folderSeg = safeIdSegment(payload.folder || 'default');
    const targetDir = resolveInside(formUploadsBaseDir(), folderSeg);
    if (!targetDir) throw new Error('Invalid form upload folder');
    await fs.mkdir(targetDir, { recursive: true });
    const cleanId = safeIdSegment(payload.id);
    const rawExt = path.extname(payload.name || '').replace(/[^a-zA-Z0-9.]/g, '').slice(0, 12);
    const ext = rawExt || fallbackExtForMime(payload.mimeType);
    const fileName = `${cleanId}${ext}`;
    const fullPath = resolveInside(targetDir, fileName);
    if (!fullPath) throw new Error('Invalid form upload path');
    const bytes = Buffer.from(payload.base64, 'base64');
    await atomicWriteFile(fullPath, bytes);
    return {
      ok: true,
      folder: folderSeg,
      fileName,
      sizeBytes: bytes.byteLength,
      url: `architect-asset://form-uploads/${encodeURIComponent(folderSeg)}/${encodeURIComponent(fileName)}`
    };
  });

  ipcMain.handle('architect:delete-asset', async (_event, fileName?: string, previewName?: string) => {
    if (fileName) {
      const target = resolveInside(assetsDir(), fileName);
      if (target && existsSync(target)) await fs.unlink(target);
    }
    if (previewName) {
      const target = resolveInside(previewsDir(), previewName);
      if (target && existsSync(target)) await fs.unlink(target);
    }
    return { ok: true };
  });

  ipcMain.handle('architect:download-asset', async (event, fileName: string, suggestedName: string) => {
    const source = resolveInside(assetsDir(), fileName);
    if (!source || !existsSync(source)) return { ok: false };
    const win = BrowserWindow.fromWebContents(event.sender) || undefined;
    const picked = await dialog.showSaveDialog(win as BrowserWindow, {
      defaultPath: path.basename(suggestedName || fileName)
    });
    if (picked.canceled || !picked.filePath) return { ok: false, canceled: true };
    await fs.copyFile(source, picked.filePath);
    return { ok: true, savedPath: picked.filePath };
  });

  ipcMain.handle('architect:choose-sync-folder', async event => {
    const win = BrowserWindow.fromWebContents(event.sender) || undefined;
    const picked = await dialog.showOpenDialog(win as BrowserWindow, {
      properties: ['openDirectory', 'createDirectory']
    });
    if (picked.canceled || !picked.filePaths[0]) return { canceled: true };
    return { canceled: false, path: picked.filePaths[0] };
  });

  ipcMain.handle('architect:choose-cache-folder', async event => {
    const win = BrowserWindow.fromWebContents(event.sender) || undefined;
    const picked = await dialog.showOpenDialog(win as BrowserWindow, {
      title: 'Choose folder for downloaded remote previews',
      properties: ['openDirectory', 'createDirectory']
    });
    if (picked.canceled || !picked.filePaths[0]) return { canceled: true };
    return { canceled: false, path: picked.filePaths[0] };
  });

  ipcMain.handle('architect:cache-remote-asset', async (_event, payload: {
    cacheDir?: string;
    fileName: string;
    base64: string;
  }) => {
    await ensureStorageDirs();
    const targetDir = payload.cacheDir?.trim() ? path.resolve(payload.cacheDir.trim()) : remoteCacheDir();
    await fs.mkdir(targetDir, { recursive: true });
    const fullPath = resolveInside(targetDir, payload.fileName);
    if (!fullPath) throw new Error('Invalid cache file name');
    await atomicWriteFile(fullPath, Buffer.from(payload.base64, 'base64'));
    return { ok: true, fileName: path.basename(fullPath), localPath: fullPath };
  });

  ipcMain.handle('architect:read-cached-remote-asset', async (_event, payload: {
    cacheDir?: string;
    fileName: string;
  }) => {
    await ensureStorageDirs();
    const targetDir = payload.cacheDir?.trim() ? path.resolve(payload.cacheDir.trim()) : remoteCacheDir();
    const fullPath = resolveInside(targetDir, payload.fileName);
    if (!fullPath || !existsSync(fullPath)) return { ok: false };
    const buf = await fs.readFile(fullPath);
    return { ok: true, base64: buf.toString('base64') };
  });

  ipcMain.handle('architect:sync-folder-pull', async (_event, folderPath: string) => {
    try {
      const cleanFolder = String(folderPath || '').trim();
      if (!cleanFolder) return { ok: false, error: 'Sync folder path is empty' };
      const base = path.resolve(cleanFolder);
      if (!existsSync(base)) return { ok: false, error: 'Sync folder does not exist' };
      const syncFile = path.join(base, 'architect-sync.json');
      if (!existsSync(syncFile)) return { ok: false, error: 'No architect-sync.json found in folder' };
      await ensureStorageDirs();
      await Promise.all([
        copyMissingFiles(path.join(base, 'assets'), assetsDir()),
        copyMissingFiles(path.join(base, 'previews'), previewsDir())
      ]);
      const [raw, stat] = await Promise.all([fs.readFile(syncFile, 'utf8'), fs.stat(syncFile)]);
      return { ok: true, raw, modifiedAt: stat.mtimeMs };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Pull failed' };
    }
  });

  ipcMain.handle('architect:sync-folder-push', async (_event, folderPath: string, raw: string) => {
    try {
      const cleanFolder = String(folderPath || '').trim();
      if (!cleanFolder) return { ok: false, error: 'Sync folder path is empty' };
      const base = path.resolve(cleanFolder);
      await fs.mkdir(base, { recursive: true });
      await ensureStorageDirs();
      await Promise.all([
        copyMissingFiles(assetsDir(), path.join(base, 'assets')),
        copyMissingFiles(previewsDir(), path.join(base, 'previews'))
      ]);
      const syncFile = path.join(base, 'architect-sync.json');
      await atomicWriteFile(syncFile, raw);
      return { ok: true, savedAt: Date.now() };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Push failed' };
    }
  });
}

function sendMenuAction(action: string): void {
  const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
  if (win && !win.webContents.isDestroyed()) {
    win.webContents.send('architect:menu-action', action);
  }
}

function installApplicationMenu(): void {
  const isMac = process.platform === 'darwin';
  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac ? [{ role: 'appMenu' as const }] : []),
    {
      label: 'File',
      submenu: [
        { label: 'New Workspace…', accelerator: 'CmdOrCtrl+Shift+N', click: () => sendMenuAction('new-workspace') },
        { label: 'Personal Options…', accelerator: 'CmdOrCtrl+,', click: () => sendMenuAction('user-settings') },
        { type: 'separator' },
        { label: 'Check for Updates…', click: () => sendMenuAction('check-updates') },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: isMac
        ? [{ role: 'minimize' }, { role: 'zoom' }, { type: 'separator' }, { role: 'front' }]
        : [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'GitHub Releases',
          click: () => { void shell.openExternal('https://github.com/CelebornArt/Architect/releases'); }
        },
        {
          label: 'About Architect',
          click: () => {
            const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
            void dialog.showMessageBox(win, {
              type: 'info',
              title: 'About Architect',
              message: `Architect v${app.getVersion()}`,
              detail: 'Local-first collaborative workspace for documents, databases, forms, boards, and teams.'
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(async () => {
  await ensureStorageDirs();
  installApplicationMenu();
  protocol.handle('architect-asset', req => {
    const parsed = new URL(req.url);
    const kind = parsed.hostname;
    const rawParts = parsed.pathname.replace(/^\/+/, '').split('/').filter(Boolean);
    if (kind === 'form-uploads') {
      if (rawParts.length < 2) return new Response('Not found', { status: 404 });
      const folderSeg = safeIdSegment(decodeURIComponent(rawParts[0]));
      const targetDir = resolveInside(formUploadsBaseDir(), folderSeg);
      const rawFile = decodeURIComponent(rawParts.slice(1).join('/'));
      const resolved = targetDir ? resolveInside(targetDir, rawFile) : null;
      if (!resolved || !existsSync(resolved)) return new Response('Not found', { status: 404 });
      return net.fetch(pathToFileURL(resolved).href, { headers: req.headers });
    }
    const rawName = decodeURIComponent(rawParts.join('/'));
    const baseDir = kind === 'previews' ? previewsDir() : kind === 'files' ? assetsDir() : null;
    if (!baseDir || !rawName) return new Response('Not found', { status: 404 });
    const resolved = resolveInside(baseDir, rawName);
    if (!resolved || !existsSync(resolved)) return new Response('Not found', { status: 404 });
    return net.fetch(pathToFileURL(resolved).href, { headers: req.headers });
  });
  registerStorageIpc();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
