const { contextBridge } = require('electron');

// Expose safe platform APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
});
