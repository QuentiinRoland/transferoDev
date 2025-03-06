import React, { useState, useEffect } from 'react';

export default function DevicesList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState({});

  useEffect(() => {
    // Vérifier si l'API Electron est disponible
    if (!window.electronAPI) {
      console.error("L'API Electron n'est pas disponible.");
      setLoading(false);
      return;
    }
  
    // Vérifier si la méthode onDevicesUpdated existe
    if (typeof window.electronAPI.onDevicesUpdated !== 'function') {
      console.error("La méthode onDevicesUpdated n'est pas disponible.");
      setLoading(false);
      return;
    }
  
    // Charger les appareils au démarrage
    const loadDevices = async () => {
      try {
        const devicesList = await window.electronAPI.getDevices();
        setDevices(devicesList || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des appareils:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadDevices();
  
    // S'abonner aux mises à jour
    const unsubscribe = window.electronAPI.onDevicesUpdated((updatedDevices) => {
      setDevices(updatedDevices || []);
    });
  
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const connectToDevice = async (deviceId) => {
    try {
      setConnectionStatus(prev => ({...prev, [deviceId]: 'connecting'}));
      const result = await window.electronAPI.connectToDevice(deviceId);
      setConnectionStatus(prev => ({...prev, [deviceId]: 'connected'}));
    } catch (error) {
      console.error("Erreur de connexion:", error);
      setConnectionStatus(prev => ({...prev, [deviceId]: 'error'}));
    }
  };

  if (loading) {
    return <div className="text-center p-4">Chargement...</div>;
  }

  if (devices.length === 0) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
        Aucun appareil trouvé sur le réseau
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {devices.map(device => (
        <div key={device.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="text-lg font-bold">{device.name}</h3>
          <p className="text-gray-600">IP: {device.host}</p>
          
          <button
            onClick={() => connectToDevice(device.id)}
            disabled={connectionStatus[device.id] === 'connecting'}
            className={`mt-3 px-4 py-2 rounded-md ${
              connectionStatus[device.id] === 'connected' 
                ? 'bg-green-500 text-white' 
                : connectionStatus[device.id] === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {connectionStatus[device.id] === 'connecting' ? 'Connexion...' :
             connectionStatus[device.id] === 'connected' ? 'Connecté' :
             connectionStatus[device.id] === 'error' ? 'Erreur' : 'Se connecter'}
          </button>
        </div>
      ))}
    </div>
  );
}