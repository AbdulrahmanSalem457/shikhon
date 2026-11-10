const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#070b14',
    title: 'Shikhon Admin | شيخون لوحة التحكم',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    autoHideMenuBar: true,
    titleBarStyle: 'default',
  });

  const indexPath = path.join(__dirname, '../dist/index.html');

  // If explicit dev URL is set via env, use it, otherwise ALWAYS load local built dist/index.html
  if (process.env.VITE_DEV_SERVER) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER).catch(() => {
      mainWindow.loadFile(indexPath);
    });
  } else {
    mainWindow.loadFile(indexPath);
  }

  // Open external links in default OS browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});