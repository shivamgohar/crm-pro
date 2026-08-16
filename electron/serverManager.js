const { spawn } = require("child_process");
const path = require("path");
const { app } = require("electron");

let serverProcess = null;

function startServer() {
  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, "server")
    : path.join(__dirname, "../server");

  console.log("Starting CRM PRO server...");
  console.log("Server path:", serverPath);

  serverProcess = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["start"],
    {
      cwd: serverPath,
      shell: true,
      windowsHide: true,
    }
  );

  serverProcess.stdout.on("data", (data) => {
    console.log(`SERVER: ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`SERVER ERROR: ${data}`);
  });

  serverProcess.on("error", (error) => {
    console.error("Failed to start server:", error);
  });

  serverProcess.on("exit", (code) => {
    console.log(`Server process exited with code: ${code}`);
    serverProcess = null;
  });
}

function stopServer() {
  if (serverProcess) {
    serverProcess.kill();
    serverProcess = null;
  }
}

module.exports = {
  startServer,
  stopServer,
};