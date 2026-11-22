import { app, BrowserWindow, dialog, ipcMain, net, protocol, shell } from 'electron';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const APP_FILE = path.join(__dirname, '..', 'index.html');
const pageWindows = new Set<BrowserWindow>();
const writeQueues = new Map<string, Promise<void>>();

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

function registerStorageIpc(): void {
  ipcMain.handle('architect:info', async () => {
    await ensureStorageDirs();
    return { dataDir: dataRoot(), platform: process.platform, version: app.getVersion() };
  });

  ipcMain.handle('architect:check-update', async (_event, feedUrl?: string) => {
    const currentVersion = app.getVersion();
    const cleanUrl = String(feedUrl || '').trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      return { currentVersion, updateAvailable: false };
    }
    try {
      const resp = await net.fetch(cleanUrl, { headers: { Accept: 'application/json' } });
      if (!resp.ok) return { currentVersion, updateAvailable: false, error: `HTTP ${resp.status}` };
      const data: any = await resp.json();
      const latestVersion = String(data?.tag_name || data?.version || '').replace(/^v/i, '').trim();
      const downloadUrl = String(data?.html_url || data?.downloadUrl || data?.url || '');
      const notes = String(data?.body || data?.notes || '');
      return {
        currentVersion,
        latestVersion,
        downloadUrl,
        notes,
        updateAvailable: Boolean(latestVersion && latestVersion !== currentVersion)
      };
    } catch (error) {
      return { currentVersion, updateAvailable: false, error: error instanceof Error ? error.message : 'Update check failed' };
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

app.whenReady().then(async () => {
  await ensureStorageDirs();
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
