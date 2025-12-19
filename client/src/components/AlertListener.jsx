import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const AlertListener = () => {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('new_alert', (data) => {
      setAlert(data);
    });
    return () => socket.disconnect();
  }, []);

  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-white overflow-hidden font-mono">
      
      {/* 0. Red Emergency Flash Background */}
      <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>

      {/* 1. Main Drone Feed Container */}
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border-2 border-red-500/50 shadow-[0_0_100px_rgba(220,38,38,0.5)] flex flex-col md:flex-row">
          
          {/* BACKGROUND IMAGE BLUR */}
          <div className="absolute inset-0 z-0">
             {alert.imageUrl && (
                 <img src={alert.imageUrl} className="w-full h-full object-cover opacity-30 blur-sm scale-110" />
             )}
          </div>
          
          {/* SCANLINES */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

          {/* LEFT PANEL: THE VISUAL */}
          <div className="relative w-full md:w-3/5 h-64 md:h-auto border-b md:border-b-0 md:border-r border-red-500/30 p-6 flex flex-col z-20 bg-black/50">
             
             {/* Header Badge */}
             <div className="absolute top-4 left-6 z-30">
                 <span className="bg-red-600/20 border border-red-500/50 text-red-200 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest backdrop-blur-md">
                    Evidence Attached
                 </span>
             </div>

             {/* The Image Itself */}
             <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-12">
                {alert.imageUrl ? (
                    <div className="relative group overflow-hidden rounded-lg border border-white/20 shadow-2xl">
                        <img 
                            src={alert.imageUrl} 
                            alt="Evidence" 
                            className="max-w-full max-h-full object-contain transform transition-transform duration-700 group-hover:scale-110" 
                        />
                         {/* Subtle Scanline on Image Only */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center opacity-40">
                        <span className="text-6xl mb-2">📷</span>
                        <span className="text-xs uppercase tracking-widest">No Visual Data</span>
                    </div>
                )}
             </div>

             {/* Corner Accents */}
             <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/30"></div>
             <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/30"></div>
             <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/30"></div>
             <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/30"></div>
          </div>

          {/* RIGHT PANEL: DATA & CONTROLS */}
          <div className="relative w-full md:w-2/5 p-8 bg-black/80 backdrop-blur-md flex flex-col justify-between z-20">
              <div>
                  <div className="flex justify-between items-start mb-6">
                      <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter leading-none">
                          Bio-Hazard<br /><span className="text-white">Detected</span>
                      </h2>
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                          Critical
                      </span>
                  </div>

                  <div className="space-y-6">
                      <div>
                          <p className="text-xs text-red-400 uppercase tracking-widest mb-1">Target Identification</p>
                          <div className="text-2xl font-bold font-sans">{alert.pestType}</div>
                      </div>
                      
                      <div>
                          <p className="text-xs text-red-400 uppercase tracking-widest mb-1">Sector Analysis</p>
                          <div className="text-lg text-white/80">{alert.location}</div>
                      </div>

                      <div className="bg-red-900/20 border-l-2 border-red-500 p-3">
                          <p className="text-xs text-red-300 uppercase tracking-widest mb-1">Directive</p>
                          <p className="text-sm italic text-white/70">"{alert.alertMessage}"</p>
                      </div>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                  <button 
                      onClick={() => setAlert(null)}
                      className="w-full py-4 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 text-white font-bold uppercase tracking-[0.2em] transition-all duration-300 group relative overflow-hidden"
                  >
                      <span className="relative z-10">Close Feed</span>
                      <div className="absolute inset-0 bg-red-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 origin-left"></div>
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AlertListener;