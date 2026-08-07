const http = require("http");

function waitForServer(
  url = "http://localhost:5000/health",
  timeout = 30000
) {

  return new Promise((resolve, reject) => {

    const start = Date.now();

    function check() {

      http.get(url, (res) => {

        if (res.statusCode === 200) {
          resolve();
        } else {
          retry();
        }

      }).on("error", retry);

    }

    function retry() {

      if (Date.now() - start > timeout) {
        reject(new Error("Backend timeout"));
        return;
      }

      setTimeout(check, 500);

    }

    check();

  });

}

module.exports = waitForServer;