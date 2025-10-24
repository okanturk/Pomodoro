import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import ModeSelector from './components/ModeSelector';
import TimerControls from './components/TimerControls';
import TaskList from './components/TaskList';
import SettingsPanel from './components/SettingsPanel';
import { Mode, Settings, Task } from './types';
import { DEFAULT_SETTINGS, MODE_CONFIG } from './constants';
import { SOUNDS } from './sounds';

const App: React.FC = () => {
  const [settings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<Mode>(Mode.Pomodoro);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(settings[mode] * 60);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Sound settings state
  const [volume, setVolume] = useState<number>(() => {
    const savedVolume = localStorage.getItem('pomodoro-volume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  const [selectedSound, setSelectedSound] = useState<string>(() => {
    return localStorage.getItem('pomodoro-sound') || SOUNDS[0].id;
  });

  const alarmSoundRef = useRef<HTMLAudioElement | null>(null);

  // Task state management
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const storedTasks = localStorage.getItem('pomodoro-tasks');
      return storedTasks ? JSON.parse(storedTasks) : [];
    } catch (error) {
      console.error("Could not parse tasks from localStorage", error);
      return [];
    }
  });
  
  // Persist tasks and settings to localStorage
  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pomodoro-volume', String(volume));
    if (alarmSoundRef.current) {
      alarmSoundRef.current.volume = volume;
    }
  }, [volume]);
  
  useEffect(() => {
    localStorage.setItem('pomodoro-sound', selectedSound);
  }, [selectedSound]);

  const selectMode = useCallback((newMode: Mode) => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(settings[newMode] * 60);
  }, [settings]);

  useEffect(() => {
    document.title = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')} - ${MODE_CONFIG[mode].label}`;
    
    // Smooth background transition effect
    const modeColorClass = MODE_CONFIG[mode].color;
    document.body.className = `antialiased bg-gray-900 transition-colors duration-500`;
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

          if (alarmSoundRef.current) {
            alarmSoundRef.current.play();
          }

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
          
          return 0;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, mode, pomodoroCount, selectMode, settings, alarmSoundRef]);

  const handleStartPause = useCallback(() => setIsActive((prev) => !prev), []);
  
  const handleReset = useCallback(() => {
    setIsActive(false);
    setSecondsLeft(settings[mode] * 60);
  }, [settings, mode]);

  const handleToggleSettings = useCallback(() => setIsSettingsOpen(prev => !prev), []);

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault(); // prevent page scroll
          handleStartPause();
          break;
        case 'r':
          handleReset();
          break;
        case 's':
          handleToggleSettings();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleStartPause, handleReset, handleToggleSettings]);

  // Settings handlers
  const handleTestSound = () => {
    if (alarmSoundRef.current) {
      alarmSoundRef.current.play();
    }
  };

  // Task handlers
  const handleAddTask = (text: string, estimatedTime?: number) => {
    if (text.trim() === '') return;
    const newTask: Task = { id: crypto.randomUUID(), text, completed: false, estimatedTime };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  const handleToggleTask = (id: string) => {
    setTasks(prevTasks => prevTasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };
  const handleDeleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };
  
  const totalSecondsForMode = settings[mode] * 60;
  const currentSoundUrl = SOUNDS.find(s => s.id === selectedSound)?.url || SOUNDS[0].url;

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 text-white bg-gray-900`}>
       <audio ref={alarmSoundRef} src={currentSoundUrl} preload="auto" />
      <main className="flex flex-col items-center justify-center space-y-6 md:space-y-8 w-full max-w-lg">
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
          onSettingsToggle={handleToggleSettings}
        />

        {isSettingsOpen && (
            <SettingsPanel
                sounds={SOUNDS}
                selectedSound={selectedSound}
                volume={volume}
                onSoundChange={setSelectedSound}
                onVolumeChange={setVolume}
                onTestSound={handleTestSound}
            />
        )}
        
        <div className="text-center">
            <p className="text-gray-400 text-lg">
                Completed Pomodoros: <span className={`font-bold text-xl ${MODE_CONFIG[Mode.Pomodoro].accentColor}`}>{pomodoroCount}</span>
            </p>
            <p className="text-gray-500 text-sm mt-1">
                Finish {settings.longBreakInterval} sessions for a long break.
            </p>
        </div>

        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          currentMode={mode}
          secondsLeft={secondsLeft}
          totalSecondsForMode={totalSecondsForMode}
        />
      </main>
    </div>
  );
};

export default App;