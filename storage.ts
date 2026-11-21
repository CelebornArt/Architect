type CoordinationMode = 'local' | 'cloud-sync' | 'server';
type AssetStorageMode = 'local' | 'drive' | 'server';
type AssetPreviewMode = 'smart-proxy' | 'download-all' | 'original-stream';
type AssetCategory = 'music' | 'sfx' | '3d model' | 'concept' | 'illustration' | 'video' | 'document' | 'image' | 'board' | 'other';

interface AssetPreviewPolicy {
  mode: AssetPreviewMode;
  maxProxySizeKB: number;
  cacheFolderPath?: string;
}

interface SyncConfig {
  driveProvider: 'local-folder' | 'google-drive' | 'webdav' | 'custom-url';
  folderPath?: string;
  sourceUrl?: string;
  serverUrl?: string;
  readOnlyMirror: boolean;
  cadence: 'on-start' | 'interval';
  intervalMinutes: number;
  lastSyncedAt?: number;
  lastSyncError?: string;
}

interface AssetRecord {
  id: string;
  name: string;
  fileType: string;
  category: AssetCategory;
  creator: string;
  uploadedBy: string;
  tags: string[];
  metadata: Record<string, string | number>;
  storageMode: 'local' | 'drive-reference' | 'server';
  provider: string;
  url?: string;
  previewDataUrl?: string;
  externalUrl?: string;
  fileName?: string;
  previewName?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  durationSec?: number;
  createdAt: number;
  updatedAt: number;
}

interface ArchitectHostBridge {
  isDesktop?: boolean;
  info(): Promise<{ dataDir: string; platform: string }>;
  readWorkspace(): Promise<string | null>;
  writeWorkspace(json: string): Promise<{ ok: boolean }>;
  readAssets(): Promise<string | null>;
  writeAssets(json: string): Promise<{ ok: boolean }>;
  saveAsset(payload: {
    id: string;
    name: string;
    mimeType: string;
    base64: string;
    previewBase64?: string;
    previewMimeType?: string;
  }): Promise<{
    ok: boolean;
    fileName: string;
    previewName?: string;
    sizeBytes: number;
    originalUrl: string;
    previewUrl?: string;
  }>;
  deleteAsset(fileName?: string, previewName?: string): Promise<{ ok: boolean }>;
  downloadAsset(fileName: string, suggestedName: string): Promise<{ ok: boolean; savedPath?: string; canceled?: boolean }>;
  chooseSyncFolder(): Promise<{ canceled: boolean; path?: string }>;
  chooseCacheFolder?(): Promise<{ canceled: boolean; path?: string }>;
  cacheRemoteAsset?(payload: { cacheDir?: string; fileName: string; base64: string }): Promise<{ ok: boolean; fileName?: string; localPath?: string }>;
  readCachedRemoteAsset?(payload: { cacheDir?: string; fileName: string }): Promise<{ ok: boolean; base64?: string }>;
  syncPullFolder(folderPath: string): Promise<{ ok: boolean; raw?: string; modifiedAt?: number; error?: string }>;
  syncPushFolder(folderPath: string, raw: string): Promise<{ ok: boolean; savedAt?: number; error?: string }>;
}

const ArchitectBackend = (() => {
  const ASSET_DB_NAME = 'architect-local-assets-v1';
  const ASSET_META_KEY = 'workspace-assets';
  const objectUrlCache = new Map<string, string>();
  const inflightRemoteCache = new Map<string, Promise<string | null>>();
  let currentPreviewPolicy: AssetPreviewPolicy = {
    mode: 'smart-proxy',
    maxProxySizeKB: 500,
    cacheFolderPath: ''
  };

  function setPreviewPolicy(policy?: Partial<AssetPreviewPolicy>): AssetPreviewPolicy {
    currentPreviewPolicy = {
      mode: policy?.mode === 'download-all' || policy?.mode === 'original-stream' ? policy.mode : 'smart-proxy',
      maxProxySizeKB: Math.max(50, Math.min(20480, Number(policy?.maxProxySizeKB) || 500)),
      cacheFolderPath: typeof policy?.cacheFolderPath === 'string' ? policy.cacheFolderPath.trim() : ''
    };
    return currentPreviewPolicy;
  }

  function getPreviewPolicy(): AssetPreviewPolicy {
    return { ...currentPreviewPolicy };
  }

  function host(): ArchitectHostBridge | null {
    return (window as unknown as { architectHost?: ArchitectHostBridge }).architectHost || null;
  }

  function openAssetDb(): Promise<IDBDatabase | null> {
    if (typeof indexedDB === 'undefined') return Promise.resolve(null);
    return new Promise(resolve => {
      try {
        const req = indexedDB.open(ASSET_DB_NAME, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs');
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function idbPut(key: string, blob: Blob): Promise<boolean> {
    const db = await openAssetDb();
    if (!db) return false;
    return new Promise(resolve => {
      try {
        const tx = db.transaction('blobs', 'readwrite');
        tx.objectStore('blobs').put(blob, key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  async function idbGet(key: string): Promise<Blob | null> {
    const db = await openAssetDb();
    if (!db) return null;
    return new Promise(resolve => {
      try {
        const tx = db.transaction('blobs', 'readonly');
        const req = tx.objectStore('blobs').get(key);
        req.onsuccess = () => resolve((req.result as Blob) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  async function idbDelete(key: string): Promise<void> {
    const db = await openAssetDb();
    if (!db) return;
    await new Promise<void>(resolve => {
      try {
        const tx = db.transaction('blobs', 'readwrite');
        tx.objectStore('blobs').delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  }

  function base64ToBlob(base64: string, mimeType = 'application/octet-stream'): Blob {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mimeType });
  }

  function dataUrlToBase64(dataUrl: string): string {
    const comma = dataUrl.indexOf(',');
    return comma >= 0 ? dataUrl.slice(comma + 1) : '';
  }

  function safeCacheSegment(raw: string): string {
    return String(raw || '').replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'asset';
  }

  function inferCategory(name: string, mimeType: string): AssetCategory {
    const lowerName = (name || '').toLowerCase();
    const lowerMime = (mimeType || '').toLowerCase();
    if (lowerMime.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac|aiff)$/.test(lowerName)) {
      return /(?:^|[^a-z0-9])(sfx|fx|foley|click|ui|hit|whoosh|ding|bell|chime)(?:[^a-z0-9]|$)/.test(lowerName) ? 'sfx' : 'music';
    }
    if (lowerMime.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/.test(lowerName)) return 'video';
    if (/\.(glb|gltf|obj|fbx|stl|blend|usd|usdz)$/.test(lowerName) || lowerMime.includes('model')) return '3d model';
    if (lowerMime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/.test(lowerName)) {
      if (/concept/i.test(lowerName)) return 'concept';
      if (/(illus|illustration|sketch|drawing)/i.test(lowerName)) return 'illustration';
      return 'image';
    }
    if (lowerName.endsWith('.pur') || lowerMime.includes('pureref')) return 'board';
    if (lowerMime.includes('pdf') || /\.(pdf|txt|md|docx?|xlsx?|csv|json)$/.test(lowerName)) return 'document';
    return 'other';
  }

  function inspectImageDimensions(blob: Blob): Promise<{ width: number; height: number }> {
    return new Promise(resolve => {
      const tempUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const width = img.naturalWidth || 0;
        const height = img.naturalHeight || 0;
        URL.revokeObjectURL(tempUrl);
        resolve({ width, height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        resolve({ width: 0, height: 0 });
      };
      img.src = tempUrl;
    });
  }

  function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality: number): Promise<Blob | null> {
    return new Promise(resolve => {
      try {
        canvas.toBlob(b => resolve(b), mime, quality);
      } catch {
        resolve(null);
      }
    });
  }

  // Fit an image within maxBytes by optimizing quality at FULL resolution first, avoiding blurry fixed-percent downscales.
  async function createByteLimitedProxy(blob: Blob, maxBytes: number): Promise<{
    width: number;
    height: number;
    proxyBlob?: Blob;
    proxyMime?: string;
    proxyDataUrl?: string;
  }> {
    return new Promise(resolve => {
      const tempUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = async () => {
        const width = img.naturalWidth || 0;
        const height = img.naturalHeight || 0;
        if (!width || !height) {
          URL.revokeObjectURL(tempUrl);
          resolve({ width: 0, height: 0 });
          return;
        }
        try {
          if (blob.size > 0 && blob.size <= maxBytes) {
            const proxyDataUrl = await fileToDataUrl(blob);
            URL.revokeObjectURL(tempUrl);
            resolve({ width, height, proxyBlob: blob, proxyMime: blob.type || 'image/webp', proxyDataUrl });
            return;
          }
          const renderAtScale = async (scale: number, qStart: number, qMin: number): Promise<Blob | null> => {
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(width * scale));
            canvas.height = Math.max(1, Math.round(height * scale));
            const ctx = canvas.getContext('2d');
            if (!ctx) return null;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Prefer WebP when supported; fall back to JPEG if canvas produces PNG or larger output
            const probeWebp = await canvasToBlob(canvas, 'image/webp', qStart);
            const mime = probeWebp && probeWebp.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
            let best: Blob | null = mime === 'image/webp' ? probeWebp : await canvasToBlob(canvas, mime, qStart);
            if (best && best.size <= maxBytes) return best;

            let lo = qMin;
            let hi = qStart;
            let candidate: Blob | null = null;
            for (let step = 0; step < 6; step++) {
              const mid = (lo + hi) / 2;
              const attempt = await canvasToBlob(canvas, mime, mid);
              if (!attempt) break;
              best = attempt;
              if (attempt.size <= maxBytes) {
                candidate = attempt;
                lo = mid;
              } else {
                hi = mid;
              }
            }
            if (candidate) return candidate;
            return await canvasToBlob(canvas, mime, qMin) || best;
          };

          let scale = Math.min(1, 4096 / Math.max(width, height));
          let chosen = await renderAtScale(scale, 0.94, 0.42);
          for (let pass = 0; pass < 3 && chosen && chosen.size > maxBytes; pass++) {
            const minScaleFloor = Math.min(scale, 256 / Math.max(1, width, height));
            const ratioScale = scale * Math.sqrt(maxBytes / Math.max(1, chosen.size)) * 0.9;
            const nextScale = Math.max(minScaleFloor, Math.min(scale * 0.85, ratioScale));
            if (nextScale >= scale * 0.98) break;
            scale = nextScale;
            const scaled = await renderAtScale(scale, 0.86, 0.38);
            if (scaled && scaled.size < chosen.size) chosen = scaled;
          }
          const proxyDataUrl = chosen ? await fileToDataUrl(chosen) : undefined;
          URL.revokeObjectURL(tempUrl);
          resolve({
            width,
            height,
            proxyBlob: chosen || undefined,
            proxyMime: chosen?.type || undefined,
            proxyDataUrl
          });
        } catch {
          URL.revokeObjectURL(tempUrl);
          resolve({ width, height });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(tempUrl);
        resolve({ width: 0, height: 0 });
      };
      img.src = tempUrl;
    });
  }

  async function inspectMediaDuration(blob: Blob, kind: 'audio' | 'video'): Promise<number | undefined> {
    return new Promise(resolve => {
      const tempUrl = URL.createObjectURL(blob);
      const el = document.createElement(kind);
      el.preload = 'metadata';
      const done = (val?: number) => {
        URL.revokeObjectURL(tempUrl);
        resolve(val);
      };
      el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? Math.round(el.duration * 10) / 10 : undefined);
      el.onerror = () => done(undefined);
      el.src = tempUrl;
    });
  }

  function readAssetCatalog(): AssetRecord[] {
    try {
      const raw = JSON.parse(localStorage.getItem(ASSET_META_KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((item): item is Partial<AssetRecord> & { name: string } => !!item && typeof item.name === 'string')
        .map(item => {
          const fileType = typeof item.fileType === 'string' && item.fileType ? item.fileType : 'image/*';
          const category = item.category || inferCategory(item.name, fileType);
          const now = Date.now();
          return {
            id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
            name: item.name,
            fileType,
            category,
            creator: typeof item.creator === 'string' && item.creator ? item.creator : 'Jordan Davis',
            uploadedBy: typeof item.uploadedBy === 'string' && item.uploadedBy ? item.uploadedBy : 'Jordan Davis',
            tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
            metadata: item.metadata && typeof item.metadata === 'object' ? item.metadata : {},
            storageMode: item.storageMode || 'local',
            provider: item.provider || 'Local storage',
            url: typeof item.url === 'string' ? item.url : undefined,
            previewDataUrl: typeof item.previewDataUrl === 'string' ? item.previewDataUrl : undefined,
            externalUrl: typeof item.externalUrl === 'string' ? item.externalUrl : undefined,
            fileName: typeof item.fileName === 'string' ? item.fileName : undefined,
            previewName: typeof item.previewName === 'string' ? item.previewName : undefined,
            sizeBytes: typeof item.sizeBytes === 'number' ? item.sizeBytes : undefined,
            width: typeof item.width === 'number' ? item.width : undefined,
            height: typeof item.height === 'number' ? item.height : undefined,
            durationSec: typeof item.durationSec === 'number' ? item.durationSec : undefined,
            createdAt: typeof item.createdAt === 'number' ? item.createdAt : now,
            updatedAt: typeof item.updatedAt === 'number' ? item.updatedAt : now
          };
        });
    } catch {
      return [];
    }
  }

  function saveAssetCatalog(assets: AssetRecord[]): void {
    const serialized = JSON.stringify(assets);
    localStorage.setItem(ASSET_META_KEY, serialized);
    const desktop = host();
    if (desktop) desktop.writeAssets(serialized).catch(() => {});
  }

  async function hydrateAssetsFromHost(): Promise<boolean> {
    const desktop = host();
    if (!desktop) return false;
    try {
      const raw = await desktop.readAssets();
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          localStorage.setItem(ASSET_META_KEY, raw);
          return true;
        }
      } else {
        const existing = localStorage.getItem(ASSET_META_KEY);
        if (existing) await desktop.writeAssets(existing);
      }
    } catch {}
    return false;
  }

  function safeHttpUrl(raw?: string): string | undefined {
    const val = (raw || '').trim();
    if (!val) return undefined;
    try {
      const u = new URL(val);
      return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : undefined;
    } catch {
      return undefined;
    }
  }

  function inferMimeFromNameAndCategory(name: string, category?: AssetCategory): string {
    const lower = (name || '').toLowerCase();
    if (lower.endsWith('.mp3')) return 'audio/mpeg';
    if (lower.endsWith('.wav')) return 'audio/wav';
    if (lower.endsWith('.ogg')) return 'audio/ogg';
    if (lower.endsWith('.flac')) return 'audio/flac';
    if (lower.endsWith('.mp4')) return 'video/mp4';
    if (lower.endsWith('.webm')) return 'video/webm';
    if (lower.endsWith('.mov')) return 'video/quicktime';
    if (lower.endsWith('.glb')) return 'model/gltf-binary';
    if (lower.endsWith('.gltf')) return 'model/gltf+json';
    if (lower.endsWith('.obj') || lower.endsWith('.fbx') || lower.endsWith('.stl') || lower.endsWith('.blend')) return 'model/mesh';
    if (lower.endsWith('.pdf')) return 'application/pdf';
    if (lower.endsWith('.pur')) return 'application/x-pureref';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (category === 'board') return 'application/x-pureref';
    if (category === 'music' || category === 'sfx') return 'audio/mpeg';
    if (category === 'video') return 'video/mp4';
    if (category === '3d model') return 'model/gltf-binary';
    if (category === 'document') return 'application/pdf';
    if (category === 'concept' || category === 'illustration' || category === 'image') return 'image/png';
    return 'application/octet-stream';
  }

  function fileToDataUrl(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error || new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  async function computeSha256Hex(file: File): Promise<string | undefined> {
    try {
      if (!crypto?.subtle) return undefined;
      const buf = await file.arrayBuffer();
      const digest = await crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      return undefined;
    }
  }

  function findDuplicateAsset(cand: {
    name?: string;
    sizeBytes?: number;
    width?: number;
    height?: number;
    sha256?: string;
  }): AssetRecord | null {
    const all = readAssetCatalog();
    if (cand.sha256) {
      const byHash = all.find(a => a.metadata?.sha256 === cand.sha256);
      if (byHash) return byHash;
    }
    const normName = (cand.name || '').trim().toLowerCase();
    const size = Number(cand.sizeBytes) || 0;
    if (!normName || size <= 0) return null;
    if (cand.width && cand.height) {
      return all.find(a =>
        (a.name || '').trim().toLowerCase() === normName &&
        a.width === cand.width &&
        a.height === cand.height &&
        (a.sizeBytes || Number(a.metadata?.sizeBytes) || 0) === size
      ) || null;
    }
    return all.find(a =>
      (a.name || '').trim().toLowerCase() === normName &&
      (a.sizeBytes || Number(a.metadata?.sizeBytes) || 0) === size
    ) || null;
  }

  async function ingestLocalFile(file: File, opts: {
    creator?: string;
    category?: AssetCategory;
    tags?: string[];
    storageMode?: AssetStorageMode;
    provider?: string;
    metadata?: Record<string, string | number>;
    previewPolicy?: AssetPreviewPolicy;
    dedupe?: boolean;
    sha256?: string;
  } = {}): Promise<AssetRecord> {
    const assetId = crypto.randomUUID();
    const mime = file.type || 'application/octet-stream';
    const category = opts.category || inferCategory(file.name, mime);
    const creator = (opts.creator || 'Jordan Davis').trim() || 'Jordan Davis';
    const tags = (opts.tags || []).map(t => t.trim()).filter(Boolean);
    const now = Date.now();
    const meta: Record<string, string | number> = { ...(opts.metadata || {}), sizeBytes: file.size };

    const storageMode = opts.storageMode === 'server' ? 'server' : 'local';
    const provider = opts.provider || (storageMode === 'server' ? 'Team server storage' : 'Local storage');
    const policy = opts.previewPolicy || currentPreviewPolicy;

    let width: number | undefined;
    let height: number | undefined;
    let previewDataUrl: string | undefined;
    let previewMime: string | undefined;
    let previewBase64: string | undefined;
    let durationSec: number | undefined;

    if (mime.startsWith('image/')) {
      if (storageMode === 'local') {
        // Local storage always displays full-resolution originals; read metadata dimensions only.
        const dims = await inspectImageDimensions(file);
        width = dims.width || undefined;
        height = dims.height || undefined;
      } else if (policy.mode === 'smart-proxy') {
        const maxBytes = Math.max(50, Number(policy.maxProxySizeKB) || 500) * 1024;
        const proxy = await createByteLimitedProxy(file, maxBytes);
        width = proxy.width || undefined;
        height = proxy.height || undefined;
        previewDataUrl = proxy.proxyDataUrl;
        previewMime = proxy.proxyMime;
        if (proxy.proxyBlob) {
          meta.proxySizeBytes = proxy.proxyBlob.size;
          meta.maxProxySizeKB = Math.round(maxBytes / 1024);
          previewBase64 = previewDataUrl ? dataUrlToBase64(previewDataUrl) : undefined;
        }
      } else {
        const dims = await inspectImageDimensions(file);
        width = dims.width || undefined;
        height = dims.height || undefined;
      }
      if (width && height) {
        meta.width = width;
        meta.height = height;
      }
    } else if (mime.startsWith('audio/') || category === 'music' || category === 'sfx') {
      durationSec = await inspectMediaDuration(file, 'audio');
      if (durationSec !== undefined) meta.durationSec = durationSec;
    } else if (mime.startsWith('video/') || category === 'video') {
      durationSec = await inspectMediaDuration(file, 'video');
      if (durationSec !== undefined) meta.durationSec = durationSec;
    }

    const sha256 = opts.sha256 || (opts.dedupe ? await computeSha256Hex(file) : undefined);
    if (sha256) meta.sha256 = sha256;
    if (opts.dedupe) {
      const existing = findDuplicateAsset({ name: file.name, sizeBytes: file.size, width, height, sha256 });
      if (existing) return existing;
    }

    const desktop = host();
    let fileName: string | undefined;
    let previewName: string | undefined;
    let inlineUrl: string | undefined;

    if (desktop) {
      const buffer = await file.arrayBuffer();
      const saved = await desktop.saveAsset({
        id: assetId,
        name: file.name,
        mimeType: mime,
        base64: arrayBufferToBase64(buffer),
        previewBase64,
        previewMimeType: previewMime
      });
      fileName = saved.fileName;
      previewName = saved.previewName;
    } else {
      const ok = await idbPut(`orig:${assetId}`, file);
      if (!ok) {
        if (file.size < 2_500_000) {
          inlineUrl = await fileToDataUrl(file);
          if (storageMode !== 'local' && !previewDataUrl && mime.startsWith('image/')) previewDataUrl = inlineUrl;
        } else {
          throw new Error('Browser storage unavailable for large file without IndexedDB');
        }
      }
    }

    const record: AssetRecord = {
      id: assetId,
      name: file.name,
      fileType: mime,
      category,
      creator,
      uploadedBy: creator,
      tags,
      metadata: meta,
      storageMode,
      provider,
      url: inlineUrl,
      previewDataUrl: storageMode === 'local' ? undefined : previewDataUrl,
      fileName,
      previewName,
      sizeBytes: file.size,
      width,
      height,
      durationSec,
      createdAt: now,
      updatedAt: now
    };
    const all = readAssetCatalog();
    all.unshift(record);
    saveAssetCatalog(all);
    return record;
  }

  function addDriveReference(input: {
    name: string;
    fileType?: string;
    category?: AssetCategory;
    creator: string;
    tags?: string[];
    externalUrl: string;
    previewUrl?: string;
    provider?: string;
    metadata?: Record<string, string | number>;
  }): AssetRecord {
    const cleanExternal = safeHttpUrl(input.externalUrl);
    if (!cleanExternal) throw new Error('Enter a valid http:// or https:// Drive or cloud URL.');
    const cleanPreview = input.previewUrl?.trim() ? safeHttpUrl(input.previewUrl) : undefined;
    if (input.previewUrl?.trim() && !cleanPreview) throw new Error('Thumbnail preview URL must be http:// or https://.');
    const resolvedCategory = input.category || inferCategory(input.name, input.fileType || '');
    const resolvedType = (input.fileType || '').trim() || inferMimeFromNameAndCategory(input.name, resolvedCategory);
    const now = Date.now();
    const record: AssetRecord = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      fileType: resolvedType,
      category: resolvedCategory,
      creator: input.creator.trim() || 'Jordan Davis',
      uploadedBy: input.creator.trim() || 'Jordan Davis',
      tags: (input.tags || []).map(t => t.trim()).filter(Boolean),
      metadata: input.metadata || {},
      storageMode: 'drive-reference',
      provider: input.provider || 'Google Drive',
      externalUrl: cleanExternal,
      previewDataUrl: cleanPreview,
      createdAt: now,
      updatedAt: now
    };
    const all = readAssetCatalog();
    all.unshift(record);
    saveAssetCatalog(all);
    return record;
  }

  function cacheFileNameForAsset(asset: AssetRecord): string {
    return `${safeCacheSegment(asset.id)}-${safeCacheSegment(asset.name)}`;
  }

  async function readCachedRemoteBlob(asset: AssetRecord, policy: AssetPreviewPolicy): Promise<Blob | null> {
    const desktop = host();
    const fileName = cacheFileNameForAsset(asset);
    if (desktop?.readCachedRemoteAsset) {
      try {
        const res = await desktop.readCachedRemoteAsset({ cacheDir: policy.cacheFolderPath, fileName });
        if (res.ok && res.base64) return base64ToBlob(res.base64, asset.fileType || 'application/octet-stream');
      } catch {}
    }
    const dirHandle = await idbGet('remote-cache-dir-handle') as unknown as {
      queryPermission?: (o: { mode: string }) => Promise<string>;
      getFileHandle?: (n: string) => Promise<{ getFile: () => Promise<File> }>;
    } | null;
    if (dirHandle?.getFileHandle) {
      try {
        if (!dirHandle.queryPermission || (await dirHandle.queryPermission({ mode: 'read' })) === 'granted') {
          const fh = await dirHandle.getFileHandle(fileName);
          return await fh.getFile();
        }
      } catch {}
    }
    return await idbGet(`remote-cache:${asset.id}`);
  }

  async function writeCachedRemoteBlob(asset: AssetRecord, blob: Blob, policy: AssetPreviewPolicy): Promise<void> {
    const desktop = host();
    const fileName = cacheFileNameForAsset(asset);
    if (desktop?.cacheRemoteAsset) {
      try {
        const buf = await blob.arrayBuffer();
        await desktop.cacheRemoteAsset({
          cacheDir: policy.cacheFolderPath,
          fileName,
          base64: arrayBufferToBase64(buf)
        });
        return;
      } catch {}
    }
    const dirHandle = await idbGet('remote-cache-dir-handle') as unknown as {
      queryPermission?: (o: { mode: string }) => Promise<string>;
      getFileHandle?: (n: string, o?: { create: boolean }) => Promise<{ createWritable: () => Promise<{ write: (d: Blob) => Promise<void>; close: () => Promise<void> }> }>;
    } | null;
    if (dirHandle?.getFileHandle) {
      try {
        if (!dirHandle.queryPermission || (await dirHandle.queryPermission({ mode: 'readwrite' })) === 'granted') {
          const fh = await dirHandle.getFileHandle(fileName, { create: true });
          const writable = await fh.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        }
      } catch {}
    }
    await idbPut(`remote-cache:${asset.id}`, blob);
  }

  async function fetchRemoteAssetBlob(asset: AssetRecord): Promise<Blob | null> {
    if (asset.externalUrl) {
      const valid = safeHttpUrl(asset.externalUrl);
      if (!valid) return null;
      try {
        const res = await fetch(valid);
        if (!res.ok) return null;
        return await res.blob();
      } catch {
        return null;
      }
    }
    if (asset.storageMode !== 'local') {
      if (asset.fileName && host()) {
        try {
          const res = await fetch(`architect-asset://files/${encodeURIComponent(asset.fileName)}`);
          if (res.ok) return await res.blob();
        } catch {}
      }
      const idbOrig = await idbGet(`orig:${asset.id}`);
      if (idbOrig) return idbOrig;
    }
    return null;
  }

  async function ensureRemoteCachedLocally(asset: AssetRecord, policy: AssetPreviewPolicy): Promise<string | null> {
    const cachedUrl = objectUrlCache.get(`remote-cache:${asset.id}`);
    if (cachedUrl) return cachedUrl;
    const inflightKey = `${asset.id}:${policy.cacheFolderPath || ''}`;
    const existing = inflightRemoteCache.get(inflightKey);
    if (existing) return existing;

    const task = (async () => {
      try {
        let blob = await readCachedRemoteBlob(asset, policy);
        if (!blob) {
          blob = await fetchRemoteAssetBlob(asset);
          if (!blob) return null;
          await writeCachedRemoteBlob(asset, blob, policy);
        }
        const objUrl = URL.createObjectURL(blob);
        objectUrlCache.set(`remote-cache:${asset.id}`, objUrl);
        return objUrl;
      } catch {
        return null;
      } finally {
        inflightRemoteCache.delete(inflightKey);
      }
    })();
    inflightRemoteCache.set(inflightKey, task);
    return task;
  }

  async function resolveAssetOriginalUrl(asset: AssetRecord): Promise<string | null> {
    const cachedRemote = objectUrlCache.get(`remote-cache:${asset.id}`);
    if (cachedRemote) return cachedRemote;
    if (asset.externalUrl) return asset.externalUrl;
    if (asset.fileName && host()) {
      return `architect-asset://files/${encodeURIComponent(asset.fileName)}`;
    }
    const cached = objectUrlCache.get(`orig:${asset.id}`);
    if (cached) return cached;
    const blob = await idbGet(`orig:${asset.id}`);
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      objectUrlCache.set(`orig:${asset.id}`, objUrl);
      return objUrl;
    }
    return asset.url || asset.previewDataUrl || null;
  }

  async function resolveAssetPreviewUrl(asset: AssetRecord, policyOverride?: AssetPreviewPolicy): Promise<string | null> {
    // Local assets always preview at full resolution without blurry downscaling
    if (asset.storageMode === 'local') {
      return resolveAssetOriginalUrl(asset);
    }

    const policy = policyOverride || currentPreviewPolicy;
    if (policy.mode === 'download-all') {
      const cachedUrl = await ensureRemoteCachedLocally(asset, policy);
      if (cachedUrl) return cachedUrl;
      return asset.previewDataUrl || resolveAssetOriginalUrl(asset);
    }

    if (policy.mode === 'original-stream') {
      return resolveAssetOriginalUrl(asset);
    }

    // smart-proxy mode: respect maxProxySizeKB without fixed-percentage pixelation
    const maxBytes = Math.max(50, Number(policy.maxProxySizeKB) || 500) * 1024;
    const proxyKey = `proxy:${asset.id}:${maxBytes}`;
    const memProxy = objectUrlCache.get(proxyKey);
    if (memProxy) return memProxy;

    if (asset.fileType.startsWith('image/')) {
      const blob = await fetchRemoteAssetBlob(asset);
      if (blob) {
        const proxy = await createByteLimitedProxy(blob, maxBytes);
        if (proxy.proxyBlob) {
          const objUrl = URL.createObjectURL(proxy.proxyBlob);
          objectUrlCache.set(proxyKey, objUrl);
          return objUrl;
        }
      }
    }

    if (asset.previewName && host()) {
      return `architect-asset://previews/${encodeURIComponent(asset.previewName)}`;
    }
    if (asset.previewDataUrl) return asset.previewDataUrl;
    return resolveAssetOriginalUrl(asset);
  }

  async function downloadFullAsset(asset: AssetRecord): Promise<void> {
    const desktop = host();
    if (desktop && asset.fileName) {
      await desktop.downloadAsset(asset.fileName, asset.name);
      return;
    }
    const originalUrl = await resolveAssetOriginalUrl(asset);
    if (!originalUrl) throw new Error('Original asset source is unavailable');
    if (asset.externalUrl && /^https?:\/\//i.test(asset.externalUrl)) {
      window.open(asset.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const a = document.createElement('a');
    a.href = originalUrl;
    a.download = asset.name || 'download';
    document.body.append(a);
    a.click();
    a.remove();
  }

  async function removeAsset(assetId: string): Promise<void> {
    const all = readAssetCatalog();
    const target = all.find(a => a.id === assetId);
    saveAssetCatalog(all.filter(a => a.id !== assetId));
    if (target?.fileName && host()) {
      await host()!.deleteAsset(target.fileName, target.previewName);
    }
    for (const key of [...objectUrlCache.keys()]) {
      if (key === `orig:${assetId}` || key === `remote-cache:${assetId}` || key.startsWith(`proxy:${assetId}:`)) {
        const u = objectUrlCache.get(key);
        if (u) URL.revokeObjectURL(u);
        objectUrlCache.delete(key);
      }
    }
    await idbDelete(`orig:${assetId}`);
    await idbDelete(`remote-cache:${assetId}`);
  }

  function updateAsset(assetId: string, patch: Partial<Pick<AssetRecord, 'name' | 'category' | 'creator' | 'tags' | 'metadata'>>): AssetRecord | null {
    const all = readAssetCatalog();
    const idx = all.findIndex(a => a.id === assetId);
    if (idx < 0) return null;
    all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() };
    saveAssetCatalog(all);
    return all[idx];
  }

  function queryAssets(assets: AssetRecord[], filter: {
    query?: string;
    category?: string;
    creator?: string;
    storageMode?: string;
  }): AssetRecord[] {
    const q = (filter.query || '').trim().toLowerCase();
    return assets.filter(asset => {
      if (filter.category && filter.category !== 'all' && asset.category !== filter.category) return false;
      if (filter.creator && filter.creator !== 'all' && asset.creator !== filter.creator) return false;
      if (filter.storageMode && filter.storageMode !== 'all' && asset.storageMode !== filter.storageMode) return false;
      if (!q) return true;
      const hay = [
        asset.name,
        asset.fileType,
        asset.category,
        asset.creator,
        asset.provider,
        ...(asset.tags || []),
        JSON.stringify(asset.metadata || {})
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  async function pullSyncSource(config: SyncConfig): Promise<{ ok: boolean; raw?: string; error?: string }> {
    const desktop = host();
    if (config.driveProvider === 'local-folder' && config.folderPath) {
      if (desktop) {
        const res = await desktop.syncPullFolder(config.folderPath);
        return res.ok ? { ok: true, raw: res.raw } : { ok: false, error: res.error || 'Folder pull failed' };
      }
      const handle = await idbGet('sync-dir-handle') as unknown as { queryPermission?: (o: { mode: string }) => Promise<string>; getFileHandle?: (n: string) => Promise<{ getFile: () => Promise<File> }> } | null;
      if (handle?.getFileHandle) {
        try {
          if (handle.queryPermission && (await handle.queryPermission({ mode: 'read' })) !== 'granted') {
            return { ok: false, error: 'Re-select folder to grant browser read permission.' };
          }
          const fh = await handle.getFileHandle('architect-sync.json');
          const file = await fh.getFile();
          return { ok: true, raw: await file.text() };
        } catch {
          return { ok: false, error: 'No architect-sync.json found in selected browser folder.' };
        }
      }
      return { ok: false, error: 'Local folder sync requires the Electron desktop app or Chromium folder access.' };
    }
    if (config.sourceUrl) {
      const validUrl = safeHttpUrl(config.sourceUrl);
      if (!validUrl) return { ok: false, error: 'Sync URL must start with http:// or https://' };
      try {
        const res = await fetch(validUrl, { cache: 'no-store' });
        if (!res.ok) return { ok: false, error: `Sync source returned HTTP ${res.status}` };
        const raw = await res.text();
        return { ok: true, raw };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Failed to fetch sync source' };
      }
    }
    return { ok: false, error: 'Configure a local sync folder or cloud sync URL first.' };
  }

  async function pushSyncTarget(config: SyncConfig, rawJson: string): Promise<{ ok: boolean; error?: string }> {
    if (config.readOnlyMirror) return { ok: false, error: 'Read-only mirrors never write to source.' };
    const desktop = host();
    if (config.driveProvider === 'local-folder' && config.folderPath) {
      if (desktop) {
        const res = await desktop.syncPushFolder(config.folderPath, rawJson);
        return res.ok ? { ok: true } : { ok: false, error: res.error || 'Folder push failed' };
      }
      const handle = await idbGet('sync-dir-handle') as unknown as { queryPermission?: (o: { mode: string }) => Promise<string>; getFileHandle?: (n: string, o?: { create: boolean }) => Promise<{ createWritable: () => Promise<{ write: (d: string) => Promise<void>; close: () => Promise<void> }> }> } | null;
      if (handle?.getFileHandle) {
        try {
          if (handle.queryPermission && (await handle.queryPermission({ mode: 'readwrite' })) !== 'granted') {
            return { ok: false, error: 'Re-select folder to grant browser write permission.' };
          }
          const fh = await handle.getFileHandle('architect-sync.json', { create: true });
          const writable = await fh.createWritable();
          await writable.write(rawJson);
          await writable.close();
          return { ok: true };
        } catch (err) {
          return { ok: false, error: err instanceof Error ? err.message : 'Browser folder write failed' };
        }
      }
      return { ok: false, error: 'Local folder sync requires the Electron desktop app or Chromium folder access.' };
    }
    if (config.sourceUrl) {
      const validUrl = safeHttpUrl(config.sourceUrl);
      if (!validUrl) return { ok: false, error: 'Sync URL must start with http:// or https://' };
      try {
        const res = await fetch(validUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: rawJson
        });
        if (!res.ok) return { ok: false, error: `Push failed with HTTP ${res.status}` };
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : 'Failed to push to sync source' };
      }
    }
    return { ok: false, error: 'Configure a writable sync target first.' };
  }

  async function pickBrowserFolder(idbKey = 'sync-dir-handle'): Promise<{ canceled: boolean; name?: string; error?: string }> {
    const picker = (window as unknown as { showDirectoryPicker?: (o: { mode: string }) => Promise<{ name: string }> }).showDirectoryPicker;
    if (!picker) return { canceled: true, error: 'Folder picker requires the Desktop app or a Chromium browser over http/https.' };
    try {
      const handle = await picker({ mode: 'readwrite' });
      await idbPut(idbKey, handle as unknown as Blob);
      return { canceled: false, name: handle.name };
    } catch {
      return { canceled: true };
    }
  }

  function pickBrowserSyncFolder(): Promise<{ canceled: boolean; name?: string; error?: string }> {
    return pickBrowserFolder('sync-dir-handle');
  }

  function pickBrowserCacheFolder(): Promise<{ canceled: boolean; name?: string; error?: string }> {
    return pickBrowserFolder('remote-cache-dir-handle');
  }

  return {
    isDesktop: () => !!host(),
    host,
    inferCategory,
    inferMimeFromNameAndCategory,
    safeHttpUrl,
    getPreviewPolicy,
    setPreviewPolicy,
    createByteLimitedProxy,
    readAssetCatalog,
    saveAssetCatalog,
    findDuplicateAsset,
    hydrateAssetsFromHost,
    ingestLocalFile,
    addDriveReference,
    resolveAssetOriginalUrl,
    resolveAssetPreviewUrl,
    downloadFullAsset,
    removeAsset,
    updateAsset,
    queryAssets,
    pullSyncSource,
    pushSyncTarget,
    pickBrowserSyncFolder,
    pickBrowserCacheFolder
  };
})();
