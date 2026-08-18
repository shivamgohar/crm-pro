const {
  BrowserWindow,
  app,
} = require("electron");

const path = require("path");

function createMainWindow() {
  const mainWindow =
    new BrowserWindow({
      width: 1400,
      height: 900,

      autoHideMenuBar: true,

      title: "QeXo",

      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,

        preload: path.join(
          __dirname,
          "preload.js"
        ),
      },
    });

  if (app.isPackaged) {
    mainWindow.loadFile(
      path.join(
        __dirname,
        "../client/dist/index.html"
      )
    );
  } else {
    mainWindow.loadURL(
      "http://localhost:5173"
    );

    mainWindow.webContents.openDevTools();
  }

  return mainWindow;
}

module.exports = {
  createMainWindow,
};