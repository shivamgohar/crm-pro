const { app, BrowserWindow } = require("electron");
const waitForServer = require("./waitForServer");

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

  if (app.isPackaged) {
    mainWindow.loadFile("client/dist/index.html");
  } else {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(async () => {
  try {
    await waitForServer();

    createWindow();

  } catch (error) {

    console.error(error);

    app.quit();

  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});