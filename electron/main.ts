import { app, BrowserWindow, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_FILE = path.join(__dirname, '..', 'index.html');
const pageWindows = new Set<BrowserWindow>();

function windowOptions(): Electron.BrowserWindowConstructorOptions {
  return {
    width: 1280,
    height: 820,
    minWidth: 760,
    minHeight: 560,
    title: 'Architect',
    backgroundColor: '#ffffff',
    webPreferences: {
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

// Middle-click or Ctrl/Cmd-click on a sidebar page opens a deep link in a
// new app window, mirroring the new-browser-tab behavior in the web build.
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
  window.loadFile(APP_FILE);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
