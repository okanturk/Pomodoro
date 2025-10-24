
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
