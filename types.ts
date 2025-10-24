export enum Mode {
  Pomodoro = 'pomodoro',
  ShortBreak = 'shortBreak',
  LongBreak = 'longBreak',
}

export interface Settings {
  [Mode.Pomodoro]: number;
  [Mode.ShortBreak]: number;
  [Mode.LongBreak]: number;
  longBreakInterval: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'alphabetical';
