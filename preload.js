// preload.js

// This script runs before the renderer process script starts,
// in a sandboxed environment. It's used to expose specific APIs
// from the main process to the renderer process in a controlled way,
// enhancing security by preventing direct access to Node.js APIs
// from the renderer.

// Example: Exposing a function to the renderer (if needed later)
// const { contextBridge, ipcRenderer } = require('electron');
// contextBridge.exposeInMainWorld('electronAPI', {
//   someFunction: () => ipcRenderer.invoke('some-function')
// });

// For this basic example, we don't need to expose anything yet,
// but it's good practice to include a preload script.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})