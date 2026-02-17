import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SymmetryAlertProps {
  dayCount: number;
  isActive: boolean;
}

const SymmetryAlert: React.FC<SymmetryAlertProps> = ({ dayCount, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
      <div className="flex items-center gap-2 px-6 py-2 bg-amber-500/10 border border-amber-500/50 rounded-full text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
        <AlertTriangle size={18} />
        <span className="font-bold tracking-widest uppercase text-sm">Symmetry Detected: {dayCount}</span>
      </div>
    </div>
  );
};

export default SymmetryAlert;
