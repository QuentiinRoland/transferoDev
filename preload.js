const { contextBridge, ipcRenderer } = require('electron');

console.log("Preload script is running");

contextBridge.exposeInMainWorld('electronAPI', {
    getDevices: () => {
        console.log("getDevices called");
        return ipcRenderer.invoke('get-devices');
    },
    onDevicesUpdated: (callback) => {
        console.log("onDevicesUpdated subscribed");
        ipcRenderer.on("devices-updated", (event, devices) => callback(devices));
        return () => {
            ipcRenderer.removeAllListeners('devices-updated');
        };
    },
    connectToDevice: (deviceId) => {
        console.log("connectToDevice called with", deviceId);
        return ipcRenderer.invoke('connect-to-device', deviceId);
    }
});

console.log("Window.electronAPI should now be available");