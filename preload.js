const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  saveSettings: (settings) => {
    console.log('saveSettings', settings)
    ipcRenderer.send('saveSettings', settings)
  },
  loadSettings: () => ipcRenderer.invoke('loadSettings'),
})
