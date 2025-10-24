
import React from 'react';

interface TimerDisplayProps {
  secondsLeft: number;
  totalSeconds: number;
  progressColor: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ secondsLeft, totalSeconds, progressColor }) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
      <svg className="absolute w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="10"
          className="stroke-gray-700/50"
          fill="transparent"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          strokeWidth="10"
          className={`transition-all duration-500 ease-linear ${progressColor}`}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="z-10 text-white text-6xl md:text-8xl font-bold tabular-nums">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default TimerDisplay;
