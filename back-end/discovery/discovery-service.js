const { Bonjour } = require('bonjour-service');
const os = require("os");
const { EventEmitter } = require('events');

class DiscoveryService extends EventEmitter {
    constructor() {
        super();
        this.bonjour = new Bonjour();
        this.service = null;
        this.browser = null;
        this.devices = new Map();
        this.mainWindow = null;

        this.deviceId = Date.now().toString();
        this.deviceName = `DevTransfero-${os.hostname().split('.')[0]}`;
    }

    setMainWindow(window) {
        this.mainWindow = window;
    }
    
    getDevices() {
        return Array.from(this.devices.values());
    }
    
    start() {
        console.log("Démarrage du service de découverte");
        console.log("ID de cet appareil:", this.deviceId);
        console.log("Nom de cet appareil:", this.deviceName);

        // Publier votre service pour que d'autres puissent le découvrir
        this.service = this.bonjour.publish({
            name: this.deviceName,
            type: 'devtransfer',
            port: 1234,
            txt: {
                id: this.deviceId
            }
        });

        // Rechercher d'autres services
        this.browser = this.bonjour.find({ type: 'devtransfer' });
        
        this.browser.on('up', service => {
            // Ne pas s'ajouter soi-même à la liste
            if (service.txt && service.txt.id === this.deviceId) {
                console.log("C'est mon propre service, je l'ignore");
                return;
            }
            
            console.log('Appareil découvert:', service.name);
            console.log('  - ID:', service.txt?.id || 'inconnu');
            console.log('  - Hôte:', service.host);
            console.log('  - Port:', service.port);
            
            this.devices.set(service.txt?.id || service.name, {
                id: service.txt?.id || service.name,
                name: service.name,
                host: service.host,
                port: service.port,
                addresses: service.addresses || []
            });

            this.notifyDevicesUpdated();
        });

        this.browser.on('down', service => {
            if (service.txt && service.txt.id === this.deviceId) {
                return;
            }

            console.log('Appareil perdu:', service.name);
            
            this.devices.delete(service.txt?.id || service.name);
            this.notifyDevicesUpdated();
        });
    }

    notifyDevicesUpdated() {
        const deviceList = Array.from(this.devices.values());
        console.log("Liste des appareils mise à jour:", deviceList);
        
        // Émettre l'événement pour les abonnés
        this.emit('devicesUpdated', deviceList);
        
        // Envoyer au render process via la mainWindow
        if (this.mainWindow && !this.mainWindow.isDestroyed()) {
            this.mainWindow.webContents.send('devices-updated', deviceList);
        }
    }
    
    stop() {
        if (this.service) {
            this.service.stop();
            this.service = null;
        }
        
        if (this.browser) {
            this.browser.stop();
            this.browser = null;
        }
        
        if (this.bonjour) {
            this.bonjour.destroy();
        }
    }
}

module.exports = new DiscoveryService();