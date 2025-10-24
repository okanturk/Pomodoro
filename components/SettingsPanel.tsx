import React from 'react';
import { Sound } from '../sounds';

interface SettingsPanelProps {
  sounds: Sound[];
  selectedSound: string;
  volume: number;
  onSoundChange: (soundId: string) => void;
  onVolumeChange: (volume: number) => void;
  onTestSound: () => void;
}

const SoundIcon: React.FC<{className: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>
);


const SettingsPanel: React.FC<SettingsPanelProps> = ({
  sounds,
  selectedSound,
  volume,
  onSoundChange,
  onVolumeChange,
  onTestSound,
}) => {
  return (
    <div className="w-full max-w-lg bg-gray-800/50 rounded-lg p-4 md:p-6 space-y-4 transition-all duration-300">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      
      {/* Sound Selection */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="sound-select" className="text-gray-300 font-medium">Alarm Sound</label>
        <div className="relative">
          <select
            id="sound-select"
            value={selectedSound}
            onChange={(e) => onSoundChange(e.target.value)}
            className="w-full appearance-none bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none transition-shadow"
          >
            {sounds.map(sound => (
              <option key={sound.id} value={sound.id}>{sound.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="volume-control" className="text-gray-300 font-medium">Volume</label>
        <div className="flex items-center space-x-3">
            <SoundIcon className="w-6 h-6 text-gray-400"/>
            <input
                id="volume-control"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
        </div>
      </div>

      <div className="flex justify-end">
        <button
            onClick={onTestSound}
            className="bg-gray-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-400"
        >
            Test Sound
        </button>
      </div>

    </div>
  );
};

export default SettingsPanel;
