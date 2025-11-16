import React from 'react';

interface TetrisNotificationProps {
  isVisible: boolean;
}

export function TetrisNotification({ isVisible }: TetrisNotificationProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-[60] pointer-events-none">
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6 rounded-2xl shadow-2xl border-4 border-yellow-300 animate-pulse">
        <div className="text-center">
          <div className="text-4xl font-black text-white mb-2 drop-shadow-lg">
            🎉 TETRIS! 🎉
          </div>
          <div className="text-lg font-bold text-white drop-shadow-md">
            4 LINES CLEARED!
          </div>
          <div className="flex justify-center mt-2 space-x-1">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-75"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-150"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-225"></div>
          </div>
        </div>
      </div>
    </div>
  );
}