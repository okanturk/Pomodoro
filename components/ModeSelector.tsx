
import React from 'react';
import { Mode } from '../types';
import { MODE_CONFIG } from '../constants';

interface ModeSelectorProps {
  currentMode: Mode;
  onSelectMode: (mode: Mode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onSelectMode }) => {
  return (
    <div className="flex justify-center items-center bg-gray-800/50 rounded-full p-1.5 space-x-2">
      {(Object.keys(MODE_CONFIG) as Mode[]).map((mode) => (
        <button
          key={mode}
          onClick={() => onSelectMode(mode)}
          className={`px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base font-semibold rounded-full transition-colors duration-300
            ${
              currentMode === mode
                ? `${MODE_CONFIG[mode].color} text-white shadow-lg`
                : 'text-gray-400 hover:bg-gray-700/50'
            }
          `}
        >
          {MODE_CONFIG[mode].label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
