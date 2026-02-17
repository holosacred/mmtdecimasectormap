
import React from 'react';
import { X, Sun, Moon } from 'lucide-react';
import { HIJRI_MONTHS } from '../../constants';
import { ArabicLetter } from '../../types';

interface ResonanceModalProps {
  onClose: () => void;
}

const ResonanceModal: React.FC<ResonanceModalProps> = ({ onClose }) => {
  // Extract all letters from the months
  const allLetters: { letter: ArabicLetter, monthId: number }[] = [];
  HIJRI_MONTHS.forEach(m => {
    m.letters.forEach(l => {
      allLetters.push({ letter: l, monthId: m.number });
    });
  });

  // Filter and deduplicate if necessary (though prompt implies showing them all)
  const sunLetters = allLetters.filter(i => i.letter.type === 'sun');
  const moonLetters = allLetters.filter(i => i.letter.type === 'moon');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 bg-slate-950/80 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="w-full h-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-slate-800/50">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-3">
              <span className="text-emerald-500">//</span> MMT Resonance Matrix
            </h2>
            <p className="text-slate-400 font-mono text-sm mt-1">Hijri Spectral & Phonetic Correspondence Protocol</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          
          {/* Phonetic Index (Top Section as requested) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Sun Letters */}
            <div className="bg-slate-950/50 border border-amber-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4 text-amber-500 font-bold uppercase tracking-wider text-sm border-b border-amber-500/20 pb-2">
                <Sun size={18} /> Solar Phonetics (Huruf Shamsiyyah)
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {sunLetters.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-2 bg-slate-900 border border-slate-800 rounded hover:border-amber-500/50 transition-colors group">
                    <span className="text-2xl font-bold text-slate-200 group-hover:text-amber-400 mb-1">{item.letter.char}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{item.letter.name}</span>
                    <span className="text-[9px] text-slate-600 bg-slate-800 px-1 rounded mt-1">M{item.monthId}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Moon Letters */}
            <div className="bg-slate-950/50 border border-indigo-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4 text-indigo-400 font-bold uppercase tracking-wider text-sm border-b border-indigo-500/20 pb-2">
                <Moon size={18} /> Lunar Phonetics (Huruf Qamariyyah)
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {moonLetters.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center justify-center p-2 bg-slate-900 border border-slate-800 rounded hover:border-indigo-400/50 transition-colors group">
                    <span className="text-2xl font-bold text-slate-200 group-hover:text-indigo-400 mb-1">{item.letter.char}</span>
                    <span className="text-[10px] text-slate-500 font-mono uppercase">{item.letter.name}</span>
                    <span className="text-[9px] text-slate-600 bg-slate-800 px-1 rounded mt-1">M{item.monthId}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Full Data Table */}
          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-800 text-xs text-slate-400 font-mono uppercase tracking-wider">
                  <th className="p-3 border-b border-slate-700">#</th>
                  <th className="p-3 border-b border-slate-700 min-w-[140px]">Month / Persona</th>
                  <th className="p-3 border-b border-slate-700">Base Clock</th>
                  <th className="p-3 border-b border-slate-700">Domain</th>
                  <th className="p-3 border-b border-slate-700">Freq / Color</th>
                  <th className="p-3 border-b border-slate-700">Letters</th>
                  <th className="p-3 border-b border-slate-700">Honeycomb</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {HIJRI_MONTHS.map((month) => (
                  <tr key={month.number} className="hover:bg-slate-800/30 transition-colors border-b border-slate-800/50 last:border-0">
                    <td className="p-3 font-mono text-slate-500">{month.number}</td>
                    <td className="p-3">
                      <div className="font-bold text-white">{month.name}</div>
                      <div className="text-xs text-emerald-500 font-mono mt-1">{month.persona}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{month.season}</div>
                    </td>
                    <td className="p-3 font-mono text-xs text-slate-300">{month.baseClock}</td>
                    <td className="p-3 text-xs text-slate-300 max-w-[200px]">{month.domain}</td>
                    <td className="p-3">
                       <div className="flex items-center gap-2 mb-1">
                         <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: month.hexColor }}></span>
                         <span className="font-mono text-xs font-bold" style={{ color: month.hexColor }}>{month.freq}</span>
                       </div>
                       <div className="text-[10px] text-slate-500">{month.colorType}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap max-w-[120px]">
                        {month.letters.map((l, i) => (
                          <span key={i} className={`text-xs px-1.5 py-0.5 rounded border ${l.type === 'sun' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-indigo-500/30 text-indigo-400 bg-indigo-500/5'}`}>
                            {l.char}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-[10px] text-slate-400 font-mono max-w-[150px]">{month.honeycomb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResonanceModal;
