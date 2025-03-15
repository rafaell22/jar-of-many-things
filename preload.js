const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  saveSettings: (settings) => {
    ipcRenderer.send('saveSettings', settings)
  },
  minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
  maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
  closeWindow: () => ipcRenderer.send('closeWindow'),
  loadSettings: () => ipcRenderer.invoke('loadSettings'),
})
