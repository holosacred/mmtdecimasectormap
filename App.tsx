import React, { useState, useEffect } from 'react';
import { Globe, Clock as ClockIcon, Map as MapIcon, Layers, Moon, Twitter, Grid } from 'lucide-react';
import DecimaMap from './components/Map/DecimaMap';
import Clock from './components/UI/Clock';
import SymmetryAlert from './components/UI/SymmetryAlert';
import ResonanceModal from './components/Data/ResonanceModal';
import { getGlobalMMT, getSectorTime, checkSymmetry } from './utils/time';
import { SECTORS } from './constants';
import { DecimaTime } from './types';

const App: React.FC = () => {
  const [mmt, setMmt] = useState<DecimaTime>(getGlobalMMT());
  const [activeSectorId, setActiveSectorId] = useState<number | null>(null);
  const [showPrayers, setShowPrayers] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  
  // High frequency loop
  useEffect(() => {
    let frameId: number;
    const loop = () => {
      setMmt(getGlobalMMT());
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const activeSector = activeSectorId !== null ? SECTORS[activeSectorId] : null;
  const activeSectorTimeRaw = activeSector ? getSectorTime(mmt.rawDeca, activeSector.id) : 0;
  
  // Create a display object for local time
  const activeSectorTimeDisplay: DecimaTime | null = activeSector ? {
    ...mmt,
    rawDeca: activeSectorTimeRaw,
    deca: Math.floor(activeSectorTimeRaw),
    cent: Math.floor((activeSectorTimeRaw - Math.floor(activeSectorTimeRaw)) * 100),
    millim: Math.floor(((activeSectorTimeRaw * 100) - Math.floor(activeSectorTimeRaw * 100)) * 10) // Approx
  } : null;

  const isSymmetric = checkSymmetry(mmt.dayCount);

  // Generate a properly encoded share URL
  const getShareUrl = () => {
    const timeString = `${mmt.dayCount}:${mmt.deca}.${mmt.cent}`;
    const locationString = activeSector ? `[${activeSector.name}]` : '[GLOBAL SCAN]';
    
    // Get current URL to include in the tweet
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Using encodeURIComponent ensures special characters and newlines are preserved in the tweet body
    const text = `// MMT DECIMA STATUS REPORT\n\nTIME: ${timeString}\nLOC: ${locationString}\n\nVisualizing the Makkah Decima Standard sector map. #MMT #Decima #TimeProtocol`;
    
    return `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}`;
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden relative">
      <SymmetryAlert dayCount={mmt.dayCount} isActive={isSymmetric} />
      
      {showMatrix && <ResonanceModal onClose={() => setShowMatrix(false)} />}

      {/* Header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/50 p-4 flex items-center justify-between z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Globe className="text-emerald-500" />
          <h1 className="text-xl font-bold tracking-wider text-slate-100 uppercase">
            MMT <span className="text-emerald-500">Decima</span> Sector Map
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Matrix Toggle */}
           <button 
             onClick={() => setShowMatrix(true)}
             className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all"
           >
             <Grid size={16} />
             <span className="hidden sm:inline">MATRIX_DATA</span>
           </button>

           {/* Moonsighting / Prayer Toggle */}
           <button 
             onClick={() => setShowPrayers(!showPrayers)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono transition-all ${showPrayers ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'}`}
           >
             <Layers size={16} />
             <span className="hidden sm:inline">ATHANI_SYNC: {showPrayers ? 'ON' : 'OFF'}</span>
             <span className="sm:hidden">SYNC</span>
           </button>

           {/* X.com Link */}
           <a 
             href={getShareUrl()}
             target="_blank" 
             rel="noopener noreferrer"
             className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-mono bg-slate-800 text-slate-400 border border-slate-700 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 transition-all"
           >
             <Twitter size={16} />
             <span className="hidden sm:inline">TRANSMIT</span>
           </a>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 h-[calc(100vh-80px)] min-h-0">
        
        {/* Left Panel: Stats & Controls - Scrollable Container */}
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Main Clock */}
          <Clock time={mmt} large />

          {/* Sector Info */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col shrink-0">
            <h2 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
              <MapIcon size={14} /> Active Sector
            </h2>
            
            {activeSector ? (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="text-2xl font-bold text-white font-mono">{activeSector.name}</div>
                <div className="text-sm text-slate-400">
                   Longitude: <span className="text-emerald-400">{activeSector.centerLon.toFixed(2)}°</span>
                   <br/>
                   Offset: <span className="text-emerald-400">+{activeSector.offset}.0 Deca</span>
                </div>
                
                <div className="mt-2 p-3 bg-slate-950 rounded border border-emerald-900/30">
                  <div className="text-xs text-emerald-600 font-mono mb-1">LOCAL SECTOR TIME</div>
                  <div className="text-3xl font-mono text-emerald-400">
                    {activeSectorTimeDisplay?.deca}
                    <span className="text-emerald-700">.</span>
                    {activeSectorTimeDisplay?.cent.toString().padStart(2,'0')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-600 gap-2 py-8">
                <Globe size={32} className="opacity-20" />
                <span className="text-sm font-mono">Select a sector on the map</span>
              </div>
            )}
          </div>

          {/* Lunar Intelligence Section */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col shrink-0">
             <h2 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
              <Moon size={14} /> Lunar Visibility Protocols
            </h2>
            <div className="space-y-3">
              <div className="p-2 rounded bg-slate-950/50 border-l-2 border-emerald-600">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-emerald-500 font-bold">LOCAL SIGHTING</div>
                  <div className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">MAJORITY CONSENSUS</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="text-slate-500 font-mono">Ikhtilaf al-Matali:</span> The traditional method. The new moon must be physically sighted within the local horizon. Lunar dates may differ by region.
                </p>
              </div>
              
              <div className="p-2 rounded bg-slate-950/50 border-l-2 border-amber-500">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-amber-500 font-bold">GLOBAL SIGHTING</div>
                  <div className="text-[9px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20">MMT STANDARD</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="text-slate-500 font-mono">Ittihad al-Matali:</span> Unified View. A reliable sighting anywhere on Earth applies globally. This aligns with the Makkah Decima unified time system.
                </p>
              </div>

              <div className="p-2 rounded bg-slate-950/50 border-l-2 border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-slate-500 font-bold">ASTRONOMICAL</div>
                  <div className="text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded border border-slate-700">CALCULATION</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  <span className="text-slate-500 font-mono">Hisab:</span> Scientific calculation of the moon's birth and visibility curves, independent of physical sighting reports.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Panel: Map */}
        <div className="lg:col-span-3 flex flex-col h-full min-h-[400px]">
          <DecimaMap 
            mmt={mmt} 
            activeSectorId={activeSectorId} 
            onSectorClick={setActiveSectorId}
            showPrayers={showPrayers}
          />
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="text-[10px] text-slate-600 font-mono">
              PROJECTION: EQUIRECTANGULAR // REF: 39.8262°E
            </div>
            <div className="flex gap-4">
               {/* Legend for Prayer Times */}
               {showPrayers && (
                 <div className="flex gap-3 text-[10px] font-mono">
                   <span className="text-emerald-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>FAJR</span>
                   <span className="text-amber-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span>DHUHR</span>
                   <span className="text-red-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span>MAGHRIB</span>
                 </div>
               )}
            </div>
          </div>
        </div>

      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5); 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8); 
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default App;