const { Bonjour } = require('bonjour-service');

class DiscoveryService {
    constructor() {
        this.bonjour = new Bonjour();
        this.service = null;
        this.browser = null;
    }
    
    start() {
        console.log("Démarrage du service de découverte");

        this.service = this.bonjour.publish({
            name: 'DevTransfer', 
            type: 'devtransfer',
            port: 1234
        });

        this.browser = this.bonjour.find({ type: 'devtransfer' });
        this.browser.on('up', service => {
            console.log('Appareil découvert:', service.name);
            console.log('  - Hôte:', service.host);
            console.log('  - Port:', service.port);
        });
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