const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAppVersion: () => ipcRenderer.invoke("app:get-version"),

  checkForUpdates: () =>
    ipcRenderer.invoke("updater:check"),

  downloadUpdate: () =>
    ipcRenderer.invoke("updater:download"),

  installUpdate: () =>
    ipcRenderer.invoke("updater:install"),

  onUpdateStatus: (callback) => {
    const channels = [
      "updater:checking",
      "updater:available",
      "updater:not-available",
      "updater:error",
      "updater:progress",
      "updater:downloaded",
    ];

    const listeners = channels.map((channel) => {
      const listener = (_event, data) => {
        callback({
          type: channel.replace("updater:", ""),
          data,
        });
      };

      ipcRenderer.on(channel, listener);

      return {
        channel,
        listener,
      };
    });

    return () => {
      listeners.forEach(({ channel, listener }) => {
        ipcRenderer.removeListener(channel, listener);
      });
    };
  },
});