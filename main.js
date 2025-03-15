import { app, BrowserWindow, ipcMain } from 'electron/main';
import initLocalServer from './server.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import fs from 'node:fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let win;

const saveSettings = async (settings) => {
  await fs.writeFile(join(app.getPath('userData'), 'config.json'), JSON.stringify(settings), 'UTF-8');
};

const loadSettings = async () => {
  const data = await fs.readFile(join(app.getPath('userData'), 'config.json'), 'UTF-8');
  return JSON.parse(data);
}

const minimizeWindow = () => win.minimize();
const maximizeWindow = () => win.maximize();
const closeWindow = () => app.quit();

initLocalServer();

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Jar of Many Things',
    autoHideMenuBar: true,
    backgroundColor: "#00000000",
    transparent: true,
    frame: false,
    webPreferences: {
      devTools: true,
      backgroundThrottling: false,
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  });

   win.webContents.openDevTools();

  win.loadFile('./public/index.html');
  win.setBackgroundColor('#00000000')
};

app.whenReady().then(() => {
  ipcMain.on('saveSettings', (event, settings) => {
    saveSettings(settings);
  });
  ipcMain.on('minimizeWindow', minimizeWindow);
  ipcMain.on('maximizeWindow', maximizeWindow);
  ipcMain.on('closeWindow', closeWindow);
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
