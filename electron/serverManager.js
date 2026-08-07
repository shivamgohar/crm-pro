const { spawn } = require("child_process");
const path = require("path");

let serverProcess = null;

function startServer() {

  const serverPath = path.join(__dirname, "../server");

  serverProcess = spawn(
    process.platform === "win32" ? "npm.cmd" : "npm",
    ["start"],
    {
      cwd: serverPath,
      shell: true,
    }
  );

  serverProcess.stdout.on("data", (data) => {
    console.log(`SERVER: ${data}`);
  });

  serverProcess.stderr.on("data", (data) => {
    console.error(`SERVER ERROR: ${data}`);
  });

}

function stopServer() {

  if (serverProcess) {
    serverProcess.kill();
  }

}

module.exports = {
  startServer,
  stopServer,
};