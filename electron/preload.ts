import { contextBridge, ipcRenderer } from 'electron';

export type ElectronAssetSavePayload = {
  id: string;
  name: string;
  mimeType: string;
  base64: string;
  previewBase64?: string;
  previewMimeType?: string;
};

contextBridge.exposeInMainWorld('architectHost', {
  isDesktop: true,
  info: (): Promise<{ dataDir: string; platform: string; version?: string }> => ipcRenderer.invoke('architect:info'),
  checkUpdate: (feedUrl?: string): Promise<{ currentVersion: string; latestVersion?: string; downloadUrl?: string; notes?: string; updateAvailable: boolean; error?: string }> =>
    ipcRenderer.invoke('architect:check-update', feedUrl),
  relaunch: (): Promise<{ ok: boolean }> => ipcRenderer.invoke('architect:relaunch'),
  readWorkspace: (): Promise<string | null> => ipcRenderer.invoke('architect:read-workspace'),
  writeWorkspace: (json: string): Promise<{ ok: boolean }> => ipcRenderer.invoke('architect:write-workspace', json),
  readAssets: (): Promise<string | null> => ipcRenderer.invoke('architect:read-assets'),
  writeAssets: (json: string): Promise<{ ok: boolean }> => ipcRenderer.invoke('architect:write-assets', json),
  saveAsset: (payload: ElectronAssetSavePayload): Promise<{
    ok: boolean;
    fileName: string;
    previewName?: string;
    sizeBytes: number;
    originalUrl: string;
    previewUrl?: string;
  }> => ipcRenderer.invoke('architect:save-asset', payload),
  saveFormUpload: (payload: {
    id: string;
    folder?: string;
    name: string;
    mimeType: string;
    base64: string;
  }): Promise<{
    ok: boolean;
    folder: string;
    fileName: string;
    sizeBytes: number;
    url: string;
  }> => ipcRenderer.invoke('architect:save-form-upload', payload),
  deleteAsset: (fileName?: string, previewName?: string): Promise<{ ok: boolean }> =>
    ipcRenderer.invoke('architect:delete-asset', fileName, previewName),
  downloadAsset: (fileName: string, suggestedName: string): Promise<{ ok: boolean; savedPath?: string; canceled?: boolean }> =>
    ipcRenderer.invoke('architect:download-asset', fileName, suggestedName),
  chooseSyncFolder: (): Promise<{ canceled: boolean; path?: string }> =>
    ipcRenderer.invoke('architect:choose-sync-folder'),
  chooseCacheFolder: (): Promise<{ canceled: boolean; path?: string }> =>
    ipcRenderer.invoke('architect:choose-cache-folder'),
  cacheRemoteAsset: (payload: { cacheDir?: string; fileName: string; base64: string }): Promise<{ ok: boolean; fileName?: string; localPath?: string }> =>
    ipcRenderer.invoke('architect:cache-remote-asset', payload),
  readCachedRemoteAsset: (payload: { cacheDir?: string; fileName: string }): Promise<{ ok: boolean; base64?: string }> =>
    ipcRenderer.invoke('architect:read-cached-remote-asset', payload),
  syncPullFolder: (folderPath: string): Promise<{ ok: boolean; raw?: string; modifiedAt?: number; error?: string }> =>
    ipcRenderer.invoke('architect:sync-folder-pull', folderPath),
  syncPushFolder: (folderPath: string, raw: string): Promise<{ ok: boolean; savedAt?: number; error?: string }> =>
    ipcRenderer.invoke('architect:sync-folder-push', folderPath, raw)
});
