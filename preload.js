// preload.js

console.log("Preload script: Starting execution."); // Log start of preload script

const { contextBridge, ipcRenderer } = require('electron'); // Import contextBridge and ipcRenderer

// Expose an API to the renderer process via the contextBridge
contextBridge.exposeInMainWorld('electronAPI', {
  // Expose a function that sends an IPC message to the main process
  // and returns a promise that resolves with the result
  getSystemFonts: () => {
    console.log("Preload script: electronAPI.getSystemFonts called."); // Log when the exposed function is called
    return ipcRenderer.invoke('get-system-fonts');
  }
});

console.log("Preload script: Finished execution. electronAPI exposed."); // Log end of preload script
