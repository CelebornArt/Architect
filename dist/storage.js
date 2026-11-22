const ArchitectBackend = (() => {
    const ASSET_DB_NAME = 'architect-local-assets-v1';
    const ASSET_META_KEY = 'workspace-assets';
    const FORM_UPLOADS_META_KEY = 'architect-form-uploads-v1';
    const objectUrlCache = new Map();
    const inflightRemoteCache = new Map();
    let currentPreviewPolicy = {
        mode: 'smart-proxy',
        maxProxySizeKB: 500,
        cacheFolderPath: ''
    };
    function setPreviewPolicy(policy) {
        currentPreviewPolicy = {
            mode: policy?.mode === 'download-all' || policy?.mode === 'original-stream' ? policy.mode : 'smart-proxy',
            maxProxySizeKB: Math.max(50, Math.min(20480, Number(policy?.maxProxySizeKB) || 500)),
            cacheFolderPath: typeof policy?.cacheFolderPath === 'string' ? policy.cacheFolderPath.trim() : ''
        };
        return currentPreviewPolicy;
    }
    function getPreviewPolicy() {
        return { ...currentPreviewPolicy };
    }
    function host() {
        return window.architectHost || null;
    }
    let assetDbPromise = null;
    function openAssetDb() {
        if (typeof indexedDB === 'undefined')
            return Promise.resolve(null);
        if (assetDbPromise)
            return assetDbPromise;
        assetDbPromise = new Promise(resolve => {
            try {
                const req = indexedDB.open(ASSET_DB_NAME, 1);
                req.onupgradeneeded = () => {
                    const db = req.result;
                    if (!db.objectStoreNames.contains('blobs'))
                        db.createObjectStore('blobs');
                };
                req.onsuccess = () => {
                    const db = req.result;
                    db.onversionchange = () => { try {
                        db.close();
                    }
                    catch { } assetDbPromise = null; };
                    db.onclose = () => { assetDbPromise = null; };
                    resolve(db);
                };
                req.onerror = () => { assetDbPromise = null; resolve(null); };
            }
            catch {
                assetDbPromise = null;
                resolve(null);
            }
        });
        return assetDbPromise;
    }
    async function idbPut(key, blob) {
        const db = await openAssetDb();
        if (!db)
            return false;
        return new Promise(resolve => {
            try {
                const tx = db.transaction('blobs', 'readwrite');
                tx.objectStore('blobs').put(blob, key);
                tx.oncomplete = () => resolve(true);
                tx.onerror = () => resolve(false);
            }
            catch {
                resolve(false);
            }
        });
    }
    async function idbGet(key) {
        const db = await openAssetDb();
        if (!db)
            return null;
        return new Promise(resolve => {
            try {
                const tx = db.transaction('blobs', 'readonly');
                const req = tx.objectStore('blobs').get(key);
                req.onsuccess = () => resolve(req.result || null);
                req.onerror = () => resolve(null);
            }
            catch {
                resolve(null);
            }
        });
    }
    async function idbDelete(key) {
        const db = await openAssetDb();
        if (!db)
            return;
        await new Promise(resolve => {
            try {
                const tx = db.transaction('blobs', 'readwrite');
                tx.objectStore('blobs').delete(key);
                tx.oncomplete = () => resolve();
                tx.onerror = () => resolve();
            }
            catch {
                resolve();
            }
        });
    }
    function arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
        }
        return btoa(binary);
    }
    function base64ToBlob(base64, mimeType = 'application/octet-stream') {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++)
            bytes[i] = binary.charCodeAt(i);
        return new Blob([bytes], { type: mimeType });
    }
    function dataUrlToBase64(dataUrl) {
        const comma = dataUrl.indexOf(',');
        return comma >= 0 ? dataUrl.slice(comma + 1) : '';
    }
    function safeCacheSegment(raw) {
        return String(raw || '').replace(/[^a-zA-Z0-9._-]+/g, '_').replace(/^_+|_+$/g, '') || 'asset';
    }
    function inferCategory(name, mimeType) {
        const lowerName = (name || '').toLowerCase();
        const lowerMime = (mimeType || '').toLowerCase();
        if (lowerMime.startsWith('audio/') || /\.(mp3|wav|ogg|flac|m4a|aac|aiff)$/.test(lowerName)) {
            return /(?:^|[^a-z0-9])(sfx|fx|foley|click|ui|hit|whoosh|ding|bell|chime)(?:[^a-z0-9]|$)/.test(lowerName) ? 'sfx' : 'music';
        }
        if (lowerMime.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi)$/.test(lowerName))
            return 'video';
        if (/\.(glb|gltf|obj|fbx|stl|blend|usd|usdz)$/.test(lowerName) || lowerMime.includes('model'))
            return '3d model';
        if (lowerMime.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/.test(lowerName)) {
            if (/concept/i.test(lowerName))
                return 'concept';
            if (/(illus|illustration|sketch|drawing)/i.test(lowerName))
                return 'illustration';
            return 'image';
        }
        if (lowerName.endsWith('.pur') || lowerMime.includes('pureref'))
            return 'board';
        if (lowerMime.includes('pdf') || /\.(pdf|txt|md|docx?|xlsx?|csv|json)$/.test(lowerName))
            return 'document';
        return 'other';
    }
    function inspectImageDimensions(blob) {
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
    function canvasToBlob(canvas, mime, quality) {
        return new Promise(resolve => {
            try {
                canvas.toBlob(b => resolve(b), mime, quality);
            }
            catch {
                resolve(null);
            }
        });
    }
    // Fit an image within maxBytes by optimizing quality at FULL resolution first, avoiding blurry fixed-percent downscales.
    async function createByteLimitedProxy(blob, maxBytes) {
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
                    const renderAtScale = async (scale, qStart, qMin) => {
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.max(1, Math.round(width * scale));
                        canvas.height = Math.max(1, Math.round(height * scale));
                        const ctx = canvas.getContext('2d');
                        if (!ctx)
                            return null;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        // Prefer WebP when supported; fall back to JPEG if canvas produces PNG or larger output
                        const probeWebp = await canvasToBlob(canvas, 'image/webp', qStart);
                        const mime = probeWebp && probeWebp.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
                        let best = mime === 'image/webp' ? probeWebp : await canvasToBlob(canvas, mime, qStart);
                        if (best && best.size <= maxBytes)
                            return best;
                        let lo = qMin;
                        let hi = qStart;
                        let candidate = null;
                        for (let step = 0; step < 6; step++) {
                            const mid = (lo + hi) / 2;
                            const attempt = await canvasToBlob(canvas, mime, mid);
                            if (!attempt)
                                break;
                            best = attempt;
                            if (attempt.size <= maxBytes) {
                                candidate = attempt;
                                lo = mid;
                            }
                            else {
                                hi = mid;
                            }
                        }
                        if (candidate)
                            return candidate;
                        return await canvasToBlob(canvas, mime, qMin) || best;
                    };
                    let scale = Math.min(1, 4096 / Math.max(width, height));
                    let chosen = await renderAtScale(scale, 0.94, 0.42);
                    for (let pass = 0; pass < 3 && chosen && chosen.size > maxBytes; pass++) {
                        const minScaleFloor = Math.min(scale, 256 / Math.max(1, width, height));
                        const ratioScale = scale * Math.sqrt(maxBytes / Math.max(1, chosen.size)) * 0.9;
                        const nextScale = Math.max(minScaleFloor, Math.min(scale * 0.85, ratioScale));
                        if (nextScale >= scale * 0.98)
                            break;
                        scale = nextScale;
                        const scaled = await renderAtScale(scale, 0.86, 0.38);
                        if (scaled && scaled.size < chosen.size)
                            chosen = scaled;
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
                }
                catch {
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
    async function inspectMediaDuration(blob, kind) {
        return new Promise(resolve => {
            const tempUrl = URL.createObjectURL(blob);
            const el = document.createElement(kind);
            el.preload = 'metadata';
            const done = (val) => {
                URL.revokeObjectURL(tempUrl);
                resolve(val);
            };
            el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? Math.round(el.duration * 10) / 10 : undefined);
            el.onerror = () => done(undefined);
            el.src = tempUrl;
        });
    }
    let cachedCatalog = null;
    let lastRawAssetJson = null;
    function readAssetCatalog() {
        try {
            const rawStr = localStorage.getItem(ASSET_META_KEY) || '[]';
            if (cachedCatalog && rawStr === lastRawAssetJson) {
                return cachedCatalog;
            }
            const raw = JSON.parse(rawStr);
            if (!Array.isArray(raw)) {
                lastRawAssetJson = rawStr;
                cachedCatalog = [];
                return cachedCatalog;
            }
            const normalized = raw
                .filter((item) => !!item && typeof item.name === 'string')
                .map(item => {
                const fileType = typeof item.fileType === 'string' && item.fileType ? item.fileType : 'image/*';
                const category = item.category || inferCategory(item.name, fileType);
                const now = Date.now();
                return {
                    id: typeof item.id === 'string' && item.id ? item.id : crypto.randomUUID(),
                    name: item.name,
                    fileType,
                    category,
                    creator: typeof item.creator === 'string' && item.creator ? item.creator : 'Raphael',
                    uploadedBy: typeof item.uploadedBy === 'string' && item.uploadedBy ? item.uploadedBy : 'Raphael',
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
            lastRawAssetJson = rawStr;
            cachedCatalog = normalized;
            return normalized;
        }
        catch {
            cachedCatalog = null;
            lastRawAssetJson = null;
            return [];
        }
    }
    function saveAssetCatalog(assets) {
        const serialized = JSON.stringify(assets);
        localStorage.setItem(ASSET_META_KEY, serialized);
        cachedCatalog = assets;
        lastRawAssetJson = serialized;
        const desktop = host();
        if (desktop)
            desktop.writeAssets(serialized).catch(() => { });
    }
    async function hydrateAssetsFromHost() {
        const desktop = host();
        if (!desktop)
            return false;
        try {
            const raw = await desktop.readAssets();
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    localStorage.setItem(ASSET_META_KEY, raw);
                    return true;
                }
            }
            else {
                const existing = localStorage.getItem(ASSET_META_KEY);
                if (existing)
                    await desktop.writeAssets(existing);
            }
        }
        catch { }
        return false;
    }
    function safeHttpUrl(raw) {
        const val = (raw || '').trim();
        if (!val)
            return undefined;
        try {
            const u = new URL(val);
            return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : undefined;
        }
        catch {
            return undefined;
        }
    }
    function inferMimeFromNameAndCategory(name, category) {
        const lower = (name || '').toLowerCase();
        if (lower.endsWith('.mp3'))
            return 'audio/mpeg';
        if (lower.endsWith('.wav'))
            return 'audio/wav';
        if (lower.endsWith('.ogg'))
            return 'audio/ogg';
        if (lower.endsWith('.flac'))
            return 'audio/flac';
        if (lower.endsWith('.mp4'))
            return 'video/mp4';
        if (lower.endsWith('.webm'))
            return 'video/webm';
        if (lower.endsWith('.mov'))
            return 'video/quicktime';
        if (lower.endsWith('.glb'))
            return 'model/gltf-binary';
        if (lower.endsWith('.gltf'))
            return 'model/gltf+json';
        if (lower.endsWith('.obj') || lower.endsWith('.fbx') || lower.endsWith('.stl') || lower.endsWith('.blend'))
            return 'model/mesh';
        if (lower.endsWith('.pdf'))
            return 'application/pdf';
        if (lower.endsWith('.pur'))
            return 'application/x-pureref';
        if (lower.endsWith('.png'))
            return 'image/png';
        if (lower.endsWith('.jpg') || lower.endsWith('.jpeg'))
            return 'image/jpeg';
        if (lower.endsWith('.webp'))
            return 'image/webp';
        if (category === 'board')
            return 'application/x-pureref';
        if (category === 'music' || category === 'sfx')
            return 'audio/mpeg';
        if (category === 'video')
            return 'video/mp4';
        if (category === '3d model')
            return 'model/gltf-binary';
        if (category === 'document')
            return 'application/pdf';
        if (category === 'concept' || category === 'illustration' || category === 'image')
            return 'image/png';
        return 'application/octet-stream';
    }
    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error || new Error('File read error'));
            reader.readAsDataURL(file);
        });
    }
    async function computeSha256Hex(file) {
        try {
            if (!crypto?.subtle)
                return undefined;
            const buf = await file.arrayBuffer();
            const digest = await crypto.subtle.digest('SHA-256', buf);
            return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
        }
        catch {
            return undefined;
        }
    }
    function findDuplicateAsset(cand) {
        const all = readAssetCatalog();
        if (cand.sha256) {
            const byHash = all.find(a => a.metadata?.sha256 === cand.sha256);
            if (byHash)
                return byHash;
        }
        const normName = (cand.name || '').trim().toLowerCase();
        const size = Number(cand.sizeBytes) || 0;
        if (!normName || size <= 0)
            return null;
        if (cand.width && cand.height) {
            return all.find(a => (a.name || '').trim().toLowerCase() === normName &&
                a.width === cand.width &&
                a.height === cand.height &&
                (a.sizeBytes || Number(a.metadata?.sizeBytes) || 0) === size) || null;
        }
        return all.find(a => (a.name || '').trim().toLowerCase() === normName &&
            (a.sizeBytes || Number(a.metadata?.sizeBytes) || 0) === size) || null;
    }
    async function ingestLocalFile(file, opts = {}) {
        const assetId = crypto.randomUUID();
        const mime = file.type || 'application/octet-stream';
        const category = opts.category || inferCategory(file.name, mime);
        const creator = (opts.creator || 'Raphael').trim() || 'Raphael';
        const tags = (opts.tags || []).map(t => t.trim()).filter(Boolean);
        const now = Date.now();
        const meta = { ...(opts.metadata || {}), sizeBytes: file.size };
        const storageMode = opts.storageMode === 'server' ? 'server' : 'local';
        const provider = opts.provider || (storageMode === 'server' ? 'Team server storage' : 'Local storage');
        const policy = opts.previewPolicy || currentPreviewPolicy;
        let width;
        let height;
        let previewDataUrl;
        let previewMime;
        let previewBase64;
        let durationSec;
        if (mime.startsWith('image/')) {
            if (storageMode === 'local') {
                // Local storage always displays full-resolution originals; read metadata dimensions only.
                const dims = await inspectImageDimensions(file);
                width = dims.width || undefined;
                height = dims.height || undefined;
            }
            else if (policy.mode === 'smart-proxy') {
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
            }
            else {
                const dims = await inspectImageDimensions(file);
                width = dims.width || undefined;
                height = dims.height || undefined;
            }
            if (width && height) {
                meta.width = width;
                meta.height = height;
            }
        }
        else if (mime.startsWith('audio/') || category === 'music' || category === 'sfx') {
            durationSec = await inspectMediaDuration(file, 'audio');
            if (durationSec !== undefined)
                meta.durationSec = durationSec;
        }
        else if (mime.startsWith('video/') || category === 'video') {
            durationSec = await inspectMediaDuration(file, 'video');
            if (durationSec !== undefined)
                meta.durationSec = durationSec;
        }
        const sha256 = opts.sha256 || (opts.dedupe ? await computeSha256Hex(file) : undefined);
        if (sha256)
            meta.sha256 = sha256;
        if (opts.dedupe) {
            const existing = findDuplicateAsset({ name: file.name, sizeBytes: file.size, width, height, sha256 });
            if (existing)
                return existing;
        }
        const desktop = host();
        let fileName;
        let previewName;
        let inlineUrl;
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
        }
        else {
            const ok = await idbPut(`orig:${assetId}`, file);
            if (!ok) {
                if (file.size < 2500000) {
                    inlineUrl = await fileToDataUrl(file);
                    if (storageMode !== 'local' && !previewDataUrl && mime.startsWith('image/'))
                        previewDataUrl = inlineUrl;
                }
                else {
                    throw new Error('Browser storage unavailable for large file without IndexedDB');
                }
            }
        }
        const record = {
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
    function addDriveReference(input) {
        const cleanExternal = safeHttpUrl(input.externalUrl);
        if (!cleanExternal)
            throw new Error('Enter a valid http:// or https:// Drive or cloud URL.');
        const cleanPreview = input.previewUrl?.trim() ? safeHttpUrl(input.previewUrl) : undefined;
        if (input.previewUrl?.trim() && !cleanPreview)
            throw new Error('Thumbnail preview URL must be http:// or https://.');
        const resolvedCategory = input.category || inferCategory(input.name, input.fileType || '');
        const resolvedType = (input.fileType || '').trim() || inferMimeFromNameAndCategory(input.name, resolvedCategory);
        const now = Date.now();
        const record = {
            id: crypto.randomUUID(),
            name: input.name.trim(),
            fileType: resolvedType,
            category: resolvedCategory,
            creator: input.creator.trim() || 'Raphael',
            uploadedBy: input.creator.trim() || 'Raphael',
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
    function cacheFileNameForAsset(asset) {
        return `${safeCacheSegment(asset.id)}-${safeCacheSegment(asset.name)}`;
    }
    async function readCachedRemoteBlob(asset, policy) {
        const desktop = host();
        const fileName = cacheFileNameForAsset(asset);
        if (desktop?.readCachedRemoteAsset) {
            try {
                const res = await desktop.readCachedRemoteAsset({ cacheDir: policy.cacheFolderPath, fileName });
                if (res.ok && res.base64)
                    return base64ToBlob(res.base64, asset.fileType || 'application/octet-stream');
            }
            catch { }
        }
        const dirHandle = await idbGet('remote-cache-dir-handle');
        if (dirHandle?.getFileHandle) {
            try {
                if (!dirHandle.queryPermission || (await dirHandle.queryPermission({ mode: 'read' })) === 'granted') {
                    const fh = await dirHandle.getFileHandle(fileName);
                    return await fh.getFile();
                }
            }
            catch { }
        }
        return await idbGet(`remote-cache:${asset.id}`);
    }
    async function writeCachedRemoteBlob(asset, blob, policy) {
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
            }
            catch { }
        }
        const dirHandle = await idbGet('remote-cache-dir-handle');
        if (dirHandle?.getFileHandle) {
            try {
                if (!dirHandle.queryPermission || (await dirHandle.queryPermission({ mode: 'readwrite' })) === 'granted') {
                    const fh = await dirHandle.getFileHandle(fileName, { create: true });
                    const writable = await fh.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    return;
                }
            }
            catch { }
        }
        await idbPut(`remote-cache:${asset.id}`, blob);
    }
    async function fetchRemoteAssetBlob(asset) {
        if (asset.externalUrl) {
            const valid = safeHttpUrl(asset.externalUrl);
            if (!valid)
                return null;
            try {
                const res = await fetch(valid);
                if (!res.ok)
                    return null;
                return await res.blob();
            }
            catch {
                return null;
            }
        }
        if (asset.storageMode !== 'local') {
            if (asset.fileName && host()) {
                try {
                    const res = await fetch(`architect-asset://files/${encodeURIComponent(asset.fileName)}`);
                    if (res.ok)
                        return await res.blob();
                }
                catch { }
            }
            const idbOrig = await idbGet(`orig:${asset.id}`);
            if (idbOrig)
                return idbOrig;
        }
        return null;
    }
    async function ensureRemoteCachedLocally(asset, policy) {
        const cachedUrl = objectUrlCache.get(`remote-cache:${asset.id}`);
        if (cachedUrl)
            return cachedUrl;
        const inflightKey = `${asset.id}:${policy.cacheFolderPath || ''}`;
        const existing = inflightRemoteCache.get(inflightKey);
        if (existing)
            return existing;
        const task = (async () => {
            try {
                let blob = await readCachedRemoteBlob(asset, policy);
                if (!blob) {
                    blob = await fetchRemoteAssetBlob(asset);
                    if (!blob)
                        return null;
                    await writeCachedRemoteBlob(asset, blob, policy);
                }
                const objUrl = URL.createObjectURL(blob);
                objectUrlCache.set(`remote-cache:${asset.id}`, objUrl);
                return objUrl;
            }
            catch {
                return null;
            }
            finally {
                inflightRemoteCache.delete(inflightKey);
            }
        })();
        inflightRemoteCache.set(inflightKey, task);
        return task;
    }
    const inflightOrigResolve = new Map();
    const inflightProxyResolve = new Map();
    async function resolveAssetOriginalUrl(asset) {
        const cachedRemote = objectUrlCache.get(`remote-cache:${asset.id}`);
        if (cachedRemote)
            return cachedRemote;
        if (asset.externalUrl)
            return asset.externalUrl;
        if (asset.fileName && host()) {
            return `architect-asset://files/${encodeURIComponent(asset.fileName)}`;
        }
        const cacheKey = `orig:${asset.id}`;
        const cached = objectUrlCache.get(cacheKey);
        if (cached)
            return cached;
        const existing = inflightOrigResolve.get(cacheKey);
        if (existing)
            return existing;
        const task = (async () => {
            try {
                const blob = await idbGet(cacheKey);
                if (blob) {
                    const objUrl = URL.createObjectURL(blob);
                    objectUrlCache.set(cacheKey, objUrl);
                    return objUrl;
                }
                return asset.url || asset.previewDataUrl || null;
            }
            finally {
                inflightOrigResolve.delete(cacheKey);
            }
        })();
        inflightOrigResolve.set(cacheKey, task);
        return task;
    }
    async function resolveAssetPreviewUrl(asset, policyOverride) {
        // Local assets always preview at full resolution without blurry downscaling
        if (asset.storageMode === 'local') {
            return resolveAssetOriginalUrl(asset);
        }
        const policy = policyOverride || currentPreviewPolicy;
        if (policy.mode === 'download-all') {
            const cachedUrl = await ensureRemoteCachedLocally(asset, policy);
            if (cachedUrl)
                return cachedUrl;
            return asset.previewDataUrl || resolveAssetOriginalUrl(asset);
        }
        if (policy.mode === 'original-stream') {
            return resolveAssetOriginalUrl(asset);
        }
        // smart-proxy mode: reuse prebuilt/cached proxies when budget matches before decoding on main thread
        const maxKb = Math.max(50, Number(policy.maxProxySizeKB) || 500);
        const maxBytes = maxKb * 1024;
        const proxyKey = `proxy:${asset.id}:${maxBytes}`;
        const memProxy = objectUrlCache.get(proxyKey);
        if (memProxy)
            return memProxy;
        const storedMaxKb = Number(asset.metadata?.maxProxySizeKB);
        if (asset.previewName && host() && (!storedMaxKb || storedMaxKb === Math.round(maxKb))) {
            return `architect-asset://previews/${encodeURIComponent(asset.previewName)}`;
        }
        if (asset.previewDataUrl && (storedMaxKb === Math.round(maxKb) || (asset.storageMode === 'drive-reference' && !storedMaxKb && maxKb === 500))) {
            return asset.previewDataUrl;
        }
        const existingTask = inflightProxyResolve.get(proxyKey);
        if (existingTask)
            return existingTask;
        const task = (async () => {
            try {
                const idbCachedProxy = await idbGet(proxyKey);
                if (idbCachedProxy) {
                    const objUrl = URL.createObjectURL(idbCachedProxy);
                    objectUrlCache.set(proxyKey, objUrl);
                    return objUrl;
                }
                if (asset.fileType.startsWith('image/')) {
                    const blob = await fetchRemoteAssetBlob(asset);
                    if (blob) {
                        const proxy = await createByteLimitedProxy(blob, maxBytes);
                        if (proxy.proxyBlob) {
                            await idbPut(proxyKey, proxy.proxyBlob).catch(() => { });
                            const objUrl = URL.createObjectURL(proxy.proxyBlob);
                            objectUrlCache.set(proxyKey, objUrl);
                            return objUrl;
                        }
                    }
                }
                if (asset.previewName && host()) {
                    return `architect-asset://previews/${encodeURIComponent(asset.previewName)}`;
                }
                if (asset.previewDataUrl)
                    return asset.previewDataUrl;
                return resolveAssetOriginalUrl(asset);
            }
            finally {
                inflightProxyResolve.delete(proxyKey);
            }
        })();
        inflightProxyResolve.set(proxyKey, task);
        return task;
    }
    async function downloadFullAsset(asset) {
        const desktop = host();
        if (desktop && asset.fileName) {
            await desktop.downloadAsset(asset.fileName, asset.name);
            return;
        }
        const originalUrl = await resolveAssetOriginalUrl(asset);
        if (!originalUrl)
            throw new Error('Original asset source is unavailable');
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
    async function removeAsset(assetId) {
        const all = readAssetCatalog();
        const target = all.find(a => a.id === assetId);
        saveAssetCatalog(all.filter(a => a.id !== assetId));
        if (target?.fileName && host()) {
            await host().deleteAsset(target.fileName, target.previewName);
        }
        for (const key of [...objectUrlCache.keys()]) {
            if (key === `orig:${assetId}` || key === `remote-cache:${assetId}` || key.startsWith(`proxy:${assetId}:`)) {
                const u = objectUrlCache.get(key);
                if (u)
                    URL.revokeObjectURL(u);
                objectUrlCache.delete(key);
            }
        }
        await idbDelete(`orig:${assetId}`);
        await idbDelete(`remote-cache:${assetId}`);
    }
    function updateAsset(assetId, patch) {
        const all = readAssetCatalog();
        const idx = all.findIndex(a => a.id === assetId);
        if (idx < 0)
            return null;
        all[idx] = { ...all[idx], ...patch, updatedAt: Date.now() };
        saveAssetCatalog(all);
        return all[idx];
    }
    function queryAssets(assets, filter) {
        const q = (filter.query || '').trim().toLowerCase();
        return assets.filter(asset => {
            if (filter.category && filter.category !== 'all' && asset.category !== filter.category)
                return false;
            if (filter.creator && filter.creator !== 'all' && asset.creator !== filter.creator)
                return false;
            if (filter.storageMode && filter.storageMode !== 'all' && asset.storageMode !== filter.storageMode)
                return false;
            if (!q)
                return true;
            if (asset.name.toLowerCase().includes(q)
                || asset.fileType.toLowerCase().includes(q)
                || asset.category.toLowerCase().includes(q)
                || asset.creator.toLowerCase().includes(q)
                || (asset.provider || '').toLowerCase().includes(q)
                || (asset.tags || []).some(t => t.toLowerCase().includes(q)))
                return true;
            const meta = asset.metadata;
            if (meta) {
                for (const v of Object.values(meta)) {
                    if (String(v ?? '').toLowerCase().includes(q))
                        return true;
                }
            }
            return false;
        });
    }
    async function pullSyncSource(config) {
        const desktop = host();
        if (config.driveProvider === 'local-folder' && config.folderPath) {
            if (desktop) {
                const res = await desktop.syncPullFolder(config.folderPath);
                return res.ok ? { ok: true, raw: res.raw } : { ok: false, error: res.error || 'Folder pull failed' };
            }
            const handle = await idbGet('sync-dir-handle');
            if (handle?.getFileHandle) {
                try {
                    if (handle.queryPermission && (await handle.queryPermission({ mode: 'read' })) !== 'granted') {
                        return { ok: false, error: 'Re-select folder to grant browser read permission.' };
                    }
                    const fh = await handle.getFileHandle('architect-sync.json');
                    const file = await fh.getFile();
                    return { ok: true, raw: await file.text() };
                }
                catch {
                    return { ok: false, error: 'No architect-sync.json found in selected browser folder.' };
                }
            }
            return { ok: false, error: 'Local folder sync requires the Electron desktop app or Chromium folder access.' };
        }
        if (config.sourceUrl) {
            const validUrl = safeHttpUrl(config.sourceUrl);
            if (!validUrl)
                return { ok: false, error: 'Sync URL must start with http:// or https://' };
            try {
                const res = await fetch(validUrl, { cache: 'no-store' });
                if (!res.ok)
                    return { ok: false, error: `Sync source returned HTTP ${res.status}` };
                const raw = await res.text();
                return { ok: true, raw };
            }
            catch (err) {
                return { ok: false, error: err instanceof Error ? err.message : 'Failed to fetch sync source' };
            }
        }
        return { ok: false, error: 'Configure a local sync folder or cloud sync URL first.' };
    }
    async function pushSyncTarget(config, rawJson) {
        if (config.readOnlyMirror)
            return { ok: false, error: 'Read-only mirrors never write to source.' };
        const desktop = host();
        if (config.driveProvider === 'local-folder' && config.folderPath) {
            if (desktop) {
                const res = await desktop.syncPushFolder(config.folderPath, rawJson);
                return res.ok ? { ok: true } : { ok: false, error: res.error || 'Folder push failed' };
            }
            const handle = await idbGet('sync-dir-handle');
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
                }
                catch (err) {
                    return { ok: false, error: err instanceof Error ? err.message : 'Browser folder write failed' };
                }
            }
            return { ok: false, error: 'Local folder sync requires the Electron desktop app or Chromium folder access.' };
        }
        if (config.sourceUrl) {
            const validUrl = safeHttpUrl(config.sourceUrl);
            if (!validUrl)
                return { ok: false, error: 'Sync URL must start with http:// or https://' };
            try {
                const res = await fetch(validUrl, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: rawJson
                });
                if (!res.ok)
                    return { ok: false, error: `Push failed with HTTP ${res.status}` };
                return { ok: true };
            }
            catch (err) {
                return { ok: false, error: err instanceof Error ? err.message : 'Failed to push to sync source' };
            }
        }
        return { ok: false, error: 'Configure a writable sync target first.' };
    }
    async function pickBrowserFolder(idbKey = 'sync-dir-handle') {
        const picker = window.showDirectoryPicker;
        if (!picker)
            return { canceled: true, error: 'Folder picker requires the Desktop app or a Chromium browser over http/https.' };
        try {
            const handle = await picker({ mode: 'readwrite' });
            await idbPut(idbKey, handle);
            return { canceled: false, name: handle.name };
        }
        catch {
            return { canceled: true };
        }
    }
    function pickBrowserSyncFolder() {
        return pickBrowserFolder('sync-dir-handle');
    }
    function pickBrowserCacheFolder() {
        return pickBrowserFolder('remote-cache-dir-handle');
    }
    function readFormUploadsCatalog() {
        try {
            const raw = JSON.parse(localStorage.getItem(FORM_UPLOADS_META_KEY) || '[]');
            return Array.isArray(raw) ? raw : [];
        }
        catch {
            return [];
        }
    }
    /** Store a form file upload in a dedicated form-uploads folder without adding it to Asset Management. */
    async function saveSeparateFormUpload(file, opts = {}) {
        const id = crypto.randomUUID();
        const mime = file.type || 'application/octet-stream';
        const folder = (opts.folder || 'form-uploads').trim().replace(/[^a-zA-Z0-9._-]+/g, '-') || 'form-uploads';
        const creator = (opts.creator || 'Raphael').trim() || 'Raphael';
        const now = Date.now();
        const desktop = host();
        let fileName;
        let url = '';
        if (desktop?.saveFormUpload) {
            const buffer = await file.arrayBuffer();
            const saved = await desktop.saveFormUpload({
                id,
                folder,
                name: file.name,
                mimeType: mime,
                base64: arrayBufferToBase64(buffer)
            });
            fileName = saved.fileName;
            url = saved.url;
        }
        else {
            const ok = await idbPut(`form-upload:${id}`, file);
            if (!ok) {
                if (file.size < 2500000) {
                    url = await fileToDataUrl(file);
                }
                else {
                    throw new Error('Browser storage unavailable for large form upload without IndexedDB');
                }
            }
            else {
                url = `form-upload://${encodeURIComponent(folder)}/${encodeURIComponent(id + '-' + file.name)}`;
            }
        }
        const record = {
            id,
            name: file.name,
            fileType: mime,
            sizeBytes: file.size,
            folder,
            fileName,
            url,
            storageLocation: 'form-uploads-folder',
            creator,
            createdAt: now
        };
        const all = readFormUploadsCatalog();
        all.unshift(record);
        try {
            localStorage.setItem(FORM_UPLOADS_META_KEY, JSON.stringify(all));
        }
        catch { }
        return record;
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
        readFormUploadsCatalog,
        saveSeparateFormUpload,
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
if (typeof window !== 'undefined')
    window.ArchitectBackend = ArchitectBackend;
