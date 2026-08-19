const { spawn, exec } = require("child_process");
const path = require("path");
const { app } = require("electron");

let serverProcess = null;
let isStopping = false;


// ==================================================
// START SERVER
// ==================================================

function startServer() {
  if (serverProcess) {
    console.log("CRM server is already running.");
    return;
  }

  const serverPath = app.isPackaged
    ? path.join(process.resourcesPath, "server")
    : path.join(__dirname, "../server");

  console.log("==========================================");
  console.log("Starting CRM server...");
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

  serverProcess.stdout?.on("data", (data) => {
    console.log(`SERVER: ${data}`);
  });

  serverProcess.stderr?.on("data", (data) => {
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


// ==================================================
// STOP SERVER
// ==================================================

function stopServer() {
  return new Promise((resolve) => {

    if (isStopping) {
      resolve();
      return;
    }

    if (!serverProcess || !serverProcess.pid) {
      serverProcess = null;
      resolve();
      return;
    }

    isStopping = true;

    const processRef = serverProcess;
    const pid = processRef.pid;

    console.log(`Stopping CRM server. PID: ${pid}`);

    // ----------------------------------------------
    // WINDOWS
    // ----------------------------------------------

    if (process.platform === "win32") {

      exec(
        `taskkill /PID ${pid} /T /F`,
        (error, stdout, stderr) => {

          if (error) {
            console.error(
              "Server process tree stop:",
              error.message
            );
          } else {
            console.log(
              "CRM server process tree stopped."
            );
          }

          serverProcess = null;
          isStopping = false;

          // Give Windows a moment to release
          // the process tree completely.
          setTimeout(() => {
            resolve();
          }, 500);
        }
      );

      return;
    }

    // ----------------------------------------------
    // LINUX / MAC
    // ----------------------------------------------

    try {
      processRef.kill("SIGTERM");
    } catch (error) {
      console.error(
        "Failed to stop server:",
        error
      );
    }

    serverProcess = null;
    isStopping = false;

    resolve();
  });
}


// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  startServer,
  stopServer,
};