export interface Sound {
  id: string;
  name: string;
  url: string;
}

export const SOUNDS: Sound[] = [
  { id: 'alarm_clock', name: 'Alarm Clock', url: 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg' },
  { id: 'bell_timer', name: 'Bell Timer', url: 'https://actions.google.com/sounds/v1/alarms/bell_timer.ogg' },
  { id: 'chime', name: 'Chime', url: 'https://actions.google.com/sounds/v1/alarms/medium_bell_ringing_near.ogg' },
  { id: 'digital_watch', name: 'Digital Watch', url: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg' },
];
