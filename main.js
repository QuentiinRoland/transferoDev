const {app, BrowserWindow, ipcMain} = require("electron")
const path = require("path")
const discoveryService = require("./back-end/discovery/discovery-service.js");

let mainWindow;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation : true,
            nodeIntegration: false
        }
    })

    mainWindow.loadURL('http://localhost:3000');

    mainWindow.webContents.openDevTools()
    discoveryService.setMainWindow(mainWindow);

    return mainWindow

}

app.whenReady().then(() => {
    createWindow();

    discoveryService.start();
    ipcMain.handle('get-devices', () => {
        return discoveryService.getDevices();
    });
})

app.on('window-all-closed', () => {
    discoveryService.stop()

    if (process.platform !== 'darwin') {
        app.quit();
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle('get-devices', async () => {
    return discoveryService.getDevices();
  });
  
  ipcMain.handle('connect-to-device', async (event, deviceId) => {
    // Votre logique de connexion
    return { success: true, deviceId };
  });