import React, { useEffect, useState } from "react";

interface TetrisUIProps {
  score: number;
  level: number;
  lines: number;
  tspinType: 'none' | 'mini' | 'full';
  combo: number;
  isPerfectClear: boolean;
}

const TetrisUI: React.FC<TetrisUIProps> = ({ score, level, lines, tspinType, combo, isPerfectClear }) => {
  const [showTspinAlert, setShowTspinAlert] = useState(false);
  const [showPerfectClearAlert, setShowPerfectClearAlert] = useState(false);
  
  useEffect(() => {
    if (tspinType !== 'none') {
      setShowTspinAlert(true);
      const timer = setTimeout(() => {
        setShowTspinAlert(false);
      }, 800); // Show T-spin alert for 0.8 seconds (much shorter)
      
      return () => clearTimeout(timer);
    }
  }, [tspinType]);
  
  useEffect(() => {
    if (isPerfectClear) {
      setShowPerfectClearAlert(true);
      const timer = setTimeout(() => {
        setShowPerfectClearAlert(false);
      }, 2500); // Show perfect clear alert for 2.5 seconds
      
      return () => clearTimeout(timer);
    } else {
      setShowPerfectClearAlert(false);
    }
  }, [isPerfectClear]);
  
  return (
    <div className="p-5 rounded-lg z-10 relative"
         style={{
           background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.4), rgba(12, 24, 41, 0.6))',
           border: '2px solid rgba(64, 224, 208, 0.3)',
           boxShadow: '0 0 20px rgba(64, 224, 208, 0.2)',
           backdropFilter: 'blur(5px)',
         }}>
      <h3 className="text-xl font-semibold mb-4 text-cyan-200"
          style={{ textShadow: '0 0 8px rgba(64, 224, 208, 0.6)' }}>
        🌊 Ocean Depths 🌊
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-cyan-300">Treasure:</span>
          <span className="font-bold text-cyan-100"
                style={{ textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}>
            {score.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-cyan-300">Depth:</span>
          <span className="font-bold text-cyan-100"
                style={{ textShadow: '0 0 5px rgba(64, 224, 208, 0.5)' }}>
            {level}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-cyan-300">Coral Lines:</span>
          <span className="font-bold text-cyan-100"
                style={{ textShadow: '0 0 5px rgba(255, 127, 80, 0.5)' }}>
            {lines}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-cyan-300">Next Depth:</span>
          <span className="font-bold text-cyan-100"
                style={{ textShadow: '0 0 5px rgba(64, 224, 208, 0.5)' }}>
            {level * 10 - (lines % 10)}
          </span>
        </div>
        
        {showPerfectClearAlert && (
          <div className="mt-4 p-4 rounded-lg border-2 shadow-2xl"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(64, 224, 208, 0.3), rgba(255, 127, 80, 0.3))',
                 border: '2px solid rgba(255, 215, 0, 0.8)',
                 boxShadow: '0 0 30px rgba(255, 215, 0, 0.6)',
                 animation: 'pulse 1s infinite',
               }}>
            <div className="flex items-center justify-center">
              <span className="font-bold text-xl text-center text-yellow-100"
                    style={{ 
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
                      animation: 'bounce 1s infinite'
                    }}>
                🏆 PERFECT CLEAR! 🏆
              </span>
            </div>
            <div className="text-center mt-2">
              <span className="text-yellow-200 text-sm">LEGENDARY DIVE!</span>
            </div>
          </div>
        )}
        
        {showTspinAlert && tspinType !== 'none' && (
          <div className="mt-2 p-2 rounded-md"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 127, 80, 0.4), rgba(64, 224, 208, 0.4))',
                 border: '1px solid rgba(255, 127, 80, 0.6)',
                 boxShadow: '0 0 15px rgba(255, 127, 80, 0.4)',
               }}>
            <div className="flex items-center justify-center">
              <span className="font-bold text-orange-100 text-sm"
                    style={{ textShadow: '0 0 5px rgba(255, 127, 80, 0.8)' }}>
                {tspinType === 'full' ? '🌪️ CORAL SPIN!' : '🌪️ MINI SPIN!'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisUI;
