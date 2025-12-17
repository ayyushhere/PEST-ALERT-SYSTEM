import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const AlertListener = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Connect to Socket Server
    const socket = io('http://localhost:5000');

    // Listen for 'new_alert' event from server
    socket.on('new_alert', (data) => {
      console.log('🚨 Alert Received:', data);
      setAlert(data);

      // Auto-hide after 10 seconds
      setTimeout(() => setAlert(null), 10000);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-4 animate-bounce-in z-50">
      <div className="flex items-start gap-3">
        <div className="text-3xl">⚠️</div>
        <div>
          <h3 className="font-bold text-gray-900">PEST ALERT: {alert.pestType}</h3>
          <p className="text-red-600 font-semibold text-sm mb-1">Severity: {alert.severity}</p>
          <p className="text-gray-600 text-sm">{alert.alertMessage}</p>
          <p className="text-xs text-gray-400 mt-2">Location: {alert.location}</p>
        </div>
        <button 
          onClick={() => setAlert(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AlertListener;