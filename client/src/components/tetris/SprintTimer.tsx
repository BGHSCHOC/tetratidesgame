import React from 'react';
import { Clock } from 'lucide-react';

interface SprintTimerProps {
  timeRemaining: number; // in seconds
  totalTime: number; // total time limit in seconds
  isVisible: boolean;
}

export function SprintTimer({ timeRemaining, totalTime, isVisible }: SprintTimerProps) {
  if (!isVisible) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // Change color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 10) return 'text-red-400 animate-pulse';
    if (timeRemaining <= 30) return 'text-orange-400';
    if (timeRemaining <= 60) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBackgroundColor = () => {
    if (timeRemaining <= 10) return 'bg-red-900/30 border-red-500/50';
    if (timeRemaining <= 30) return 'bg-orange-900/30 border-orange-500/50';
    if (timeRemaining <= 60) return 'bg-yellow-900/30 border-yellow-500/50';
    return 'bg-green-900/30 border-green-500/50';
  };

  return (
    <div className={`
      ${getBackgroundColor()}
      border-2 rounded-xl p-3 lg:p-6 mb-2 lg:mb-4 transition-all duration-300 shadow-xl
      ${timeRemaining <= 10 ? 'animate-pulse' : ''}
      relative z-10 w-full
    `}>
      <div className="text-center mb-2">
        <div className="text-sm font-semibold text-gray-300 mb-1">TIME REMAINING</div>
        <div className="flex items-center justify-center gap-2 lg:gap-3">
          <Clock className={`h-5 w-5 lg:h-6 lg:w-6 ${getTimerColor()}`} />
          <span className={`text-2xl lg:text-4xl font-black ${getTimerColor()} tracking-wider`}>
            {timeString}
          </span>
        </div>
      </div>
      
      {timeRemaining <= 30 && (
        <div className="text-center mt-3">
          <span className={`text-sm font-bold ${getTimerColor()} animate-bounce`}>
            {timeRemaining <= 10 ? '⚠️ HURRY UP! ⚠️' : '⏰ TIME RUNNING OUT! ⏰'}
          </span>
        </div>
      )}
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeRemaining <= 10 ? 'bg-red-500' :
              timeRemaining <= 30 ? 'bg-orange-500' :
              timeRemaining <= 60 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ 
              width: `${Math.max(0, Math.min(100, (timeRemaining / totalTime) * 100))}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}