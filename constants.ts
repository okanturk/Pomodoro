
import { Settings, Mode } from './types';

export const DEFAULT_SETTINGS: Settings = {
  [Mode.Pomodoro]: 25,
  [Mode.ShortBreak]: 5,
  [Mode.LongBreak]: 15,
  longBreakInterval: 4,
};

export const MODE_CONFIG = {
  [Mode.Pomodoro]: {
    label: 'Pomodoro',
    color: 'bg-red-500',
    accentColor: 'text-red-400',
    progressColor: 'stroke-red-400',
  },
  [Mode.ShortBreak]: {
    label: 'Short Break',
    color: 'bg-blue-500',
    accentColor: 'text-blue-400',
    progressColor: 'stroke-blue-400',
  },
  [Mode.LongBreak]: {
    label: 'Long Break',
    color: 'bg-green-500',
    accentColor: 'text-green-400',
    progressColor: 'stroke-green-400',
  },
};
