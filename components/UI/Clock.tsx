import React from 'react';
import { DecimaTime } from '../../types';

interface ClockProps {
  time: DecimaTime;
  label?: string;
  large?: boolean;
}

const Clock: React.FC<ClockProps> = ({ time, label = "MMT GLOBAL", large = false }) => {
  const formatDigit = (n: number) => n.toString();
  const formatMulti = (n: number, pad: number) => n.toString().padStart(pad, '0');

  return (
    <div className={`flex flex-col ${large ? 'items-center' : 'items-start'} p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-lg`}>
      <span className="text-xs text-emerald-600 font-bold tracking-widest mb-1">{label}</span>
      <div className={`font-mono flex items-baseline ${large ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>
        {/* Day Count */}
        <span className="text-slate-400 mr-3">{time.dayCount.toLocaleString()}</span>
        <span className="text-slate-600 mr-3">:</span>
        
        {/* Deca */}
        <span className="text-emerald-400 font-bold">{time.deca}</span>
        <span className="text-emerald-600">.</span>
        
        {/* Cent */}
        <span className="text-emerald-400">{formatMulti(time.cent, 2)}</span>
        
        {/* Millim (Small) */}
        <span className="text-emerald-700 text-sm ml-1">{formatMulti(time.millim, 3)}</span>
      </div>
    </div>
  );
};

export default Clock;
