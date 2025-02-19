import { app, BrowserWindow } from 'electron/main';
import initLocalServer from './server.js';

initLocalServer();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    title: "Jar of Many Things",
    autoHideMenuBar: true,
  });

  win.webContents.openDevTools();

  win.loadFile("./public/index.html");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
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
