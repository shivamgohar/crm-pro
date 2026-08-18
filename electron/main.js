const { app, ipcMain } = require("electron");

const { autoUpdater } = require("electron-updater");

const { createMainWindow } = require("./windowManager");
const { startServer, stopServer } = require("./serverManager");
const waitForServer = require("./waitForServer");

let mainWindow;

// --------------------------------------------------
// AUTO UPDATER CONFIG
// --------------------------------------------------

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;


// --------------------------------------------------
// SEND UPDATE EVENT TO REACT
// --------------------------------------------------

function sendUpdateEvent(channel, data = null) {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send(channel, data);
}


// --------------------------------------------------
// UPDATE EVENTS
// --------------------------------------------------

autoUpdater.on("checking-for-update", () => {
  console.log("Checking for updates...");

  sendUpdateEvent("updater:checking");
});


autoUpdater.on("update-available", (info) => {
  console.log("Update available:", info.version);

  sendUpdateEvent("updater:available", {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseName: info.releaseName,
    releaseNotes: info.releaseNotes,
  });
});


autoUpdater.on("update-not-available", (info) => {
  console.log("Application is up to date.");

  sendUpdateEvent("updater:not-available", {
    version: info.version,
  });
});


autoUpdater.on("error", (error) => {
  console.error("Updater error:", error);

  sendUpdateEvent("updater:error", {
    message: error?.message || "Update check failed.",
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
  console.log("Update downloaded:", info.version);

  sendUpdateEvent("updater:downloaded", {
    version: info.version,
  });
});


// --------------------------------------------------
// IPC
// --------------------------------------------------

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});


ipcMain.handle("updater:check", async () => {
  if (!app.isPackaged) {
    return {
      success: false,
      message: "Updates are available only in the packaged application.",
    };
  }

  try {
    await autoUpdater.checkForUpdates();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update check failed:", error);

    return {
      success: false,
      message: error?.message || "Unable to check for updates.",
    };
  }
});


ipcMain.handle("updater:download", async () => {
  if (!app.isPackaged) {
    return {
      success: false,
      message: "Download is available only in the packaged application.",
    };
  }

  try {
    await autoUpdater.downloadUpdate();

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update download failed:", error);

    return {
      success: false,
      message: error?.message || "Unable to download update.",
    };
  }
});


ipcMain.handle("updater:install", () => {
  if (!app.isPackaged) {
    return {
      success: false,
      message: "Install is available only in the packaged application.",
    };
  }

  autoUpdater.quitAndInstall();

  return {
    success: true,
  };
});


// --------------------------------------------------
// APP STARTUP
// --------------------------------------------------

app.whenReady().then(async () => {
  try {
    // Start backend
    startServer();

    // Wait for backend
    await waitForServer();

    // Create Electron window
    mainWindow = createMainWindow();

  } catch (error) {
    console.error("CRM PRO startup error:", error);

    app.quit();
  }
});


// --------------------------------------------------
// APP EVENTS
// --------------------------------------------------

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
});const {
  app,
  ipcMain,
} = require("electron");

const {
  autoUpdater,
} = require("electron-updater");

const {
  createMainWindow,
} = require("./windowManager");

const {
  startServer,
  stopServer,
} = require("./serverManager");

const waitForServer = require("./waitForServer");

let mainWindow;

// ==========================================
// AUTO UPDATER CONFIG
// ==========================================

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// ==========================================
// SEND UPDATE STATUS TO RENDERER
// ==========================================

function sendUpdateStatus(channel, data = null) {
  if (
    mainWindow &&
    !mainWindow.isDestroyed()
  ) {
    mainWindow.webContents.send(
      channel,
      data
    );
  }
}

// ==========================================
// UPDATE EVENTS
// ==========================================

autoUpdater.on("checking-for-update", () => {
  console.log(
    "Checking for application updates..."
  );

  sendUpdateStatus(
    "updater:checking"
  );
});

autoUpdater.on(
  "update-available",
  (info) => {
    console.log(
      "Update available:",
      info.version
    );

    sendUpdateStatus(
      "updater:available",
      {
        version: info.version,
      }
    );
  }
);

autoUpdater.on(
  "update-not-available",
  (info) => {
    console.log(
      "Application is up to date:",
      info.version
    );

    sendUpdateStatus(
      "updater:not-available",
      {
        version: info.version,
      }
    );
  }
);

autoUpdater.on(
  "download-progress",
  (progress) => {
    sendUpdateStatus(
      "updater:progress",
      {
        percent: progress.percent,
        transferred: progress.transferred,
        total: progress.total,
        bytesPerSecond:
          progress.bytesPerSecond,
      }
    );
  }
);

autoUpdater.on(
  "update-downloaded",
  (info) => {
    console.log(
      "Update downloaded:",
      info.version
    );

    sendUpdateStatus(
      "updater:downloaded",
      {
        version: info.version,
      }
    );
  }
);

autoUpdater.on(
  "error",
  (error) => {
    console.error(
      "Auto updater error:",
      error
    );

    sendUpdateStatus(
      "updater:error",
      {
        message:
          error?.message ||
          "Update service error.",
      }
    );
  }
);

// ==========================================
// IPC - APP VERSION
// ==========================================

ipcMain.handle(
  "app:get-version",
  () => {
    return app.getVersion();
  }
);

// ==========================================
// IPC - CHECK FOR UPDATE
// ==========================================

ipcMain.handle(
  "updater:check",
  async () => {
    try {
      if (!app.isPackaged) {
        return {
          success: false,
          message:
            "Updates are available only in the packaged desktop application.",
        };
      }

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

// ==========================================
// IPC - DOWNLOAD UPDATE
// ==========================================

ipcMain.handle(
  "updater:download",
  async () => {
    try {
      if (!app.isPackaged) {
        return {
          success: false,
          message:
            "Updates are available only in the packaged desktop application.",
        };
      }

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

// ==========================================
// IPC - INSTALL UPDATE
// ==========================================

ipcMain.handle(
  "updater:install",
  () => {
    if (!app.isPackaged) {
      return {
        success: false,
        message:
          "Updates are available only in the packaged desktop application.",
      };
    }

    autoUpdater.quitAndInstall(
      false,
      true
    );

    return {
      success: true,
    };
  }
);

// ==========================================
// APPLICATION START
// ==========================================

app.whenReady().then(async () => {
  try {
    // Start backend server
    startServer();

    // Wait until backend is ready
    await waitForServer();

    // Create Electron window
    mainWindow =
      createMainWindow();

  } catch (error) {
    console.error(
      "CRM PRO startup error:",
      error
    );

    app.quit();
  }
});

// ==========================================
// BEFORE QUIT
// ==========================================

app.on(
  "before-quit",
  () => {
    stopServer();
  }
);

// ==========================================
// WINDOW CLOSED
// ==========================================

app.on(
  "window-all-closed",
  () => {
    if (
      process.platform !==
      "darwin"
    ) {
      app.quit();
    }
  }
);

// ==========================================
// MAC ACTIVATE
// ==========================================

app.on(
  "activate",
  () => {
    if (
      mainWindow === null
    ) {
      mainWindow =
        createMainWindow();
    }
  }
);