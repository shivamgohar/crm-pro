const { app, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

const { createMainWindow } = require("./windowManager");
const { startServer, stopServer } = require("./serverManager");
const waitForServer = require("./waitForServer");

let mainWindow = null;
let isUpdating = false;
let updateDownloaded = false;


// ==================================================
// AUTO UPDATER CONFIG
// ==================================================

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;


// ==================================================
// SEND UPDATE EVENT TO REACT
// ==================================================

function sendUpdateEvent(channel, data = null) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send(channel, data);
}


// ==================================================
// UPDATE EVENTS
// ==================================================

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");

  sendUpdateEvent("updater:checking");
});


autoUpdater.on("update-available", (info) => {
  console.log(
    "Update available:",
    info.version
  );

  updateDownloaded = false;

  sendUpdateEvent("updater:available", {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseName: info.releaseName,
    releaseNotes: info.releaseNotes,
  });
});


autoUpdater.on("update-not-available", (info) => {
  console.log(
    "Application is up to date:",
    info.version
  );

  updateDownloaded = false;

  sendUpdateEvent("updater:not-available", {
    version: info.version,
  });
});


autoUpdater.on("download-progress", (progress) => {
  sendUpdateEvent("updater:progress", {
    percent: progress.percent,
    transferred: progress.transferred,
    total: progress.total,
    bytesPerSecond: progress.bytesPerSecond,
  });
});


autoUpdater.on("update-downloaded", (info) => {
  console.log(
    "Update downloaded:",
    info.version
  );

  updateDownloaded = true;

  sendUpdateEvent("updater:downloaded", {
    version: info.version,
  });
});


autoUpdater.on("error", (error) => {
  console.error(
    "Auto updater error:",
    error
  );

  isUpdating = false;

  sendUpdateEvent("updater:error", {
    message:
      error?.message ||
      "Update service error.",
  });
});


// ==================================================
// IPC - APP VERSION
// ==================================================

ipcMain.handle(
  "app:get-version",
  () => {
    return app.getVersion();
  }
);


// ==================================================
// IPC - CHECK FOR UPDATE
// ==================================================

ipcMain.handle(
  "updater:check",
  async () => {

    if (!app.isPackaged) {
      return {
        success: false,
        message:
          "Updates are available only in the packaged desktop application.",
      };
    }

    try {

      const result =
        await autoUpdater.checkForUpdates();

      return {
        success: true,
        version:
          result?.updateInfo?.version ||
          null,
      };

    } catch (error) {

      console.error(
        "Update check failed:",
        error
      );

      return {
        success: false,
        message:
          error?.message ||
          "Unable to check for updates.",
      };
    }
  }
);


// ==================================================
// IPC - DOWNLOAD UPDATE
// ==================================================

ipcMain.handle(
  "updater:download",
  async () => {

    if (!app.isPackaged) {
      return {
        success: false,
        message:
          "Updates are available only in the packaged desktop application.",
      };
    }

    try {

      updateDownloaded = false;

      await autoUpdater.downloadUpdate();

      return {
        success: true,
      };

    } catch (error) {

      console.error(
        "Update download failed:",
        error
      );

      return {
        success: false,
        message:
          error?.message ||
          "Unable to download update.",
      };
    }
  }
);


// ==================================================
// IPC - INSTALL UPDATE
// ==================================================

ipcMain.handle(
  "updater:install",
  async () => {

    if (!app.isPackaged) {
      return {
        success: false,
        message:
          "Updates are available only in the packaged desktop application.",
      };
    }


    if (isUpdating) {
      return {
        success: false,
        message:
          "Update installation is already in progress.",
      };
    }


    if (!updateDownloaded) {
      return {
        success: false,
        message:
          "Update has not been downloaded yet.",
      };
    }


    try {

      isUpdating = true;

      console.log(
        "=========================================="
      );

      console.log(
        "Preparing QeXo for update..."
      );


      // ------------------------------------------
      // STOP BACKEND
      // ------------------------------------------

      console.log(
        "Stopping CRM backend..."
      );

      await stopServer();

      console.log(
        "CRM backend stopped."
      );


      // ------------------------------------------
      // GIVE WINDOWS TIME TO RELEASE PROCESS
      // ------------------------------------------

      await new Promise(
        (resolve) => {
          setTimeout(
            resolve,
            1000
          );
        }
      );


      console.log(
        "Starting QeXo update installer..."
      );


      // ------------------------------------------
      // INSTALL + RESTART
      // ------------------------------------------

      autoUpdater.quitAndInstall(
        true,
        true
      );


      return {
        success: true,
      };

    } catch (error) {

      console.error(
        "Update installation failed:",
        error
      );

      isUpdating = false;

      return {
        success: false,
        message:
          error?.message ||
          "Unable to install update.",
      };
    }
  }
);


// ==================================================
// APPLICATION START
// ==================================================

app.whenReady().then(
  async () => {

    try {

      console.log(
        "Starting QeXo application..."
      );


      // ------------------------------------------
      // START BACKEND
      // ------------------------------------------

      startServer();


      // ------------------------------------------
      // WAIT FOR BACKEND
      // ------------------------------------------

      await waitForServer();


      console.log(
        "Backend server is ready."
      );


      // ------------------------------------------
      // CREATE WINDOW
      // ------------------------------------------

      mainWindow =
        createMainWindow();

    } catch (error) {

      console.error(
        "QeXo startup error:",
        error
      );

      app.quit();
    }
  }
);


// ==================================================
// BEFORE QUIT
// ==================================================

app.on(
  "before-quit",
  (event) => {

    console.log(
      "QeXo is closing..."
    );


    // ------------------------------------------
    // UPDATE FLOW
    // ------------------------------------------
    //
    // During update, server was already stopped
    // before quitAndInstall().
    //
    // DO NOT call stopServer() again.
    //

    if (isUpdating) {

      console.log(
        "Update installation in progress. Skipping duplicate server shutdown."
      );

      return;
    }


    // ------------------------------------------
    // NORMAL APPLICATION CLOSE
    // ------------------------------------------

    stopServer();
  }
);


// ==================================================
// WINDOW CLOSED
// ==================================================

app.on(
  "window-all-closed",
  () => {

    if (process.platform !== "darwin") {
      app.quit();
    }
  }
);


// ==================================================
// MAC ACTIVATE
// ==================================================

app.on(
  "activate",
  () => {

    if (mainWindow === null) {

      mainWindow =
        createMainWindow();
    }
  }
);