import React from 'react';
import DevicesList from './components/DeviceList';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">DevTransfer</h1>
        <p className="text-sm">Transfert de fichiers entre appareils</p>
      </header>
      
      <main className="container mx-auto p-4 mt-4">
        <DevicesList />
      </main>
    </div>
  );
}

export default App;