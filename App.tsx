
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import ModeSelector from './components/ModeSelector';
import TimerControls from './components/TimerControls';
import { Mode, Settings } from './types';
import { DEFAULT_SETTINGS, MODE_CONFIG } from './constants';

const App: React.FC = () => {
  const [settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>(Mode.Pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(settings[mode] * 60);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);

  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    alarmSoundRef.current = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
  }, []);

  const selectMode = useCallback((newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(settings[newMode] * 60);
  }, [settings]);

  useEffect(() => {
    const totalDuration = settings[mode] * 60;
    document.title = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')} - ${MODE_CONFIG[mode].label}`;
    
    // Update body background color based on mode
    const modeColorClass = MODE_CONFIG[mode].color;
    document.body.className = `antialiased bg-gray-900 transition-colors duration-500`; // Reset and set base
    
    // Use a trick to smoothly transition background color
    const transitioner = document.createElement('div');
    transitioner.className = `fixed inset-0 -z-10 transition-opacity duration-1000 ${modeColorClass} opacity-0`;
    document.body.appendChild(transitioner);
    setTimeout(() => transitioner.classList.add('opacity-30'), 50);
    setTimeout(() => document.body.removeChild(transitioner), 1050);


  }, [secondsLeft, mode, settings]);

  useEffect(() => {
    let interval: number | undefined = undefined;

    if (isActive) {
      interval = window.setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          }

          // Timer finished
          if (alarmSoundRef.current) {
            alarmSoundRef.current.play();
          }

          // Automatic mode switching
          if (mode === Mode.Pomodoro) {
            const newPomodoroCount = pomodoroCount + 1;
            setPomodoroCount(newPomodoroCount);
            if (newPomodoroCount % settings.longBreakInterval === 0) {
              selectMode(Mode.LongBreak);
            } else {
              selectMode(Mode.ShortBreak);
            }
          } else {
            selectMode(Mode.Pomodoro);
          }
          
          return 0; // Fallback, but selectMode should handle it
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, mode, pomodoroCount, selectMode, settings, alarmSoundRef]);

  const handleStartPause = () => {
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(settings[mode] * 60);
  };
  
  const totalSecondsForMode = settings[mode] * 60;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 text-white bg-gray-900`}>
      <main className="flex flex-col items-center justify-center space-y-8 md:space-y-12 w-full max-w-lg">
        <ModeSelector currentMode={mode} onSelectMode={selectMode} />
        
        <TimerDisplay
          secondsLeft={secondsLeft}
          totalSeconds={totalSecondsForMode}
          progressColor={MODE_CONFIG[mode].progressColor}
        />

        <TimerControls
          isActive={isActive}
          isPaused={!isActive && secondsLeft < totalSecondsForMode}
          currentMode={mode}
          onStartPause={handleStartPause}
          onReset={handleReset}
        />
        
        <div className="text-center">
            <p className="text-gray-400 text-lg">
                Completed Pomodoros: <span className={`font-bold text-xl ${MODE_CONFIG[Mode.Pomodoro].accentColor}`}>{pomodoroCount}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
                Finish {settings.longBreakInterval} sessions for a long break.
            </p>
        </div>
      </main>
    </div>
  );
};

export default App;
