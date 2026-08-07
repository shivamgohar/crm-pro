const { app, BrowserWindow } = require("electron");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    autoHideMenuBar: true,
    title: "CRM PRO",

    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Vite Dev Server
  mainWindow.loadURL("http://localhost:5173");

  // DevTools (abhi debugging ke liye)
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});