const {app, BrowserWindow} = require("electron")
const DiscoveryService = require("./back-end/discovery/discovery-service");
const discoveryService = require("./back-end/discovery/discovery-service");

let mainWindow;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    })

    mainWindow.loadFile("index.html")
    mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()

    discoveryService.start()
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