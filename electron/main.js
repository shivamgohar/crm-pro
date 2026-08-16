const { app } = require("electron");

const { autoUpdater } = require("electron-updater");

const { createMainWindow } = require("./windowManager");
const { startServer, stopServer } = require("./serverManager");
const waitForServer = require("./waitForServer");

let mainWindow;

app.whenReady().then(async () => {
  try {
    // Start backend server
    startServer();

    // Wait until backend is ready
    await waitForServer();

    // Create Electron window
    mainWindow = createMainWindow();

    // Check for application updates
    if (app.isPackaged) {
      autoUpdater.checkForUpdatesAndNotify();
    }

  } catch (error) {
    console.error("CRM PRO startup error:", error);

    app.quit();
  }
});

app.on("before-quit", () => {
  stopServer();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});