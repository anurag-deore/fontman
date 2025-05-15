// main.js

const { app, BrowserWindow, ipcMain } = require('electron'); // Import ipcMain
const path = require('path');
const SystemFonts = require('system-font-families').default; // Require system-font-families in the main process

function createWindow() {
  // Construct the full path to the preload script
  const preloadPath = path.join(__dirname, 'preload.js');
  // console.log(`Main process: Preload script path is: ${preloadPath}`); // Log the preload path

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    minHeight: 800,
    height: 600,
    title: "FontMan - Font Viewer",
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      devTools: false,
      preload: preloadPath, // Use the constructed preload path
      nodeIntegration: false, // Keep nodeIntegration disabled
      contextIsolation: true // Keep contextIsolation enabled
    },
    autoHideMenuBar: true,
    hasShadow: true
  });
  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools(); // Uncomment to open developer tools
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// --- IPC Main Process Handlers ---

// Handler for the 'get-system-fonts' IPC message from the renderer
ipcMain.handle('get-system-fonts', async () => {
  try {
    const systemFonts = new SystemFonts();
    // Use the synchronous method in the main process
    const fontFamilies = systemFonts.getFontsSync();
    return fontFamilies; // Send the font list back to the renderer
  } catch (error) {
    throw error; // Re-throw the error to be caught in the renderer
  }
});

// In this file you can include the rest of your app's specific main process code.
// You can also put them in separate files and require them here.
