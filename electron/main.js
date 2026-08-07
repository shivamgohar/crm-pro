const { app, BrowserWindow } = require("electron");
const path = require("path");

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

const path = require("path");

if (app.isPackaged) {
  mainWindow.loadFile(
    path.join(__dirname, "../client/dist/index.html")
  );
} else {
  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();
}
}

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});