import { app, BrowserWindow, ipcMain } from 'electron/main';
import initLocalServer from './server.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const saveSettings = async (settings) => {
  await fs.writeFile(join(app.getPath('userData'), 'config.json'), JSON.stringify(settings), 'UTF-8');
};

const loadSettings = async () => {
  const data = await fs.readFile(join(app.getPath('userData'), 'config.json'), 'UTF-8');
  return JSON.parse(data);
}

initLocalServer();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Jar of Many Things',
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });

  // win.webContents.openDevTools();

  win.loadFile('./public/index.html');
};

app.whenReady().then(() => {
  ipcMain.on('saveSettings', (event, settings) => {
    saveSettings(settings);
  });
  ipcMain.handle('loadSettings', loadSettings)
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
