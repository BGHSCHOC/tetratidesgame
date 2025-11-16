import React, { useEffect, useState } from 'react';

interface ComboBubbleProps {
  combo: number;
  isVisible: boolean;
}

export function ComboBubble({ combo, isVisible }: ComboBubbleProps) {
  const [showPulse, setShowPulse] = useState(false);
  const [comboType, setComboType] = useState<'2-wide' | '3-wide' | '4-wide' | 'mega'>('2-wide');

  useEffect(() => {
    if (combo >= 3) {
      setShowPulse(true);
      
      // Determine combo type based on combo count
      if (combo >= 3 && combo <= 5) {
        setComboType('2-wide');
      } else if (combo >= 6 && combo <= 8) {
        setComboType('3-wide');
      } else if (combo >= 9 && combo <= 10) {
        setComboType('4-wide');
      } else {
        setComboType('mega'); // 11+ is legendary
      }
      
      const timer = setTimeout(() => setShowPulse(false), 500);
      return () => clearTimeout(timer);
    }
  }, [combo]);

  if (!isVisible || combo < 3) return null;

  const getComboStyles = () => {
    switch (comboType) {
      case '2-wide':
        return {
          container: "bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 border-2 border-cyan-300 shadow-lg shadow-cyan-500/40",
          text: "text-white",
          glow: "drop-shadow-lg",
          particles: "✨",
          name: "2-WIDE"
        };
      case '3-wide':
        return {
          container: "bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 border-2 border-pink-300 shadow-xl shadow-pink-500/50",
          text: "text-white",
          glow: "drop-shadow-xl",
          particles: "🔥✨🔥",
          name: "3-WIDE"
        };
      case '4-wide':
        return {
          container: "bg-gradient-to-br from-yellow-300 via-orange-500 to-red-600 border-3 border-yellow-200 shadow-2xl shadow-orange-500/60",
          text: "text-white",
          glow: "drop-shadow-2xl",
          particles: "💥🔥✨🔥💥",
          name: "4-WIDE"
        };
      case 'mega':
        return {
          container: "bg-gradient-to-br from-purple-500 via-pink-500 via-yellow-400 via-orange-500 to-red-600 border-4 border-white shadow-2xl shadow-purple-500/70 animate-pulse",
          text: "text-white",
          glow: "drop-shadow-2xl",
          particles: "🌟💥🔥✨🔥💥🌟",
          name: "LEGENDARY"
        };
    }
  };

  const styles = getComboStyles();
  const scale = Math.min(1 + (combo - 3) * 0.05, 1.5); // Scale up with combo count

  return (
    <div className="fixed left-20 top-1/2 transform -translate-y-1/2 z-50">
      <div 
        className={`
          relative rounded-2xl p-6 transition-all duration-300 transform
          ${styles.container}
          ${showPulse ? 'animate-bounce scale-110' : ''}
        `}
        style={{ transform: `scale(${scale}) translateY(-50%)` }}
      >
        {/* Particle effects background */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -top-2 -left-2 text-2xl animate-spin opacity-80">
            {styles.particles.split('')[0]}
          </div>
          <div className="absolute -top-1 -right-2 text-xl animate-bounce opacity-70">
            {styles.particles.split('')[1] || '✨'}
          </div>
          <div className="absolute -bottom-2 -left-1 text-lg animate-pulse opacity-60">
            {styles.particles.split('')[2] || '✨'}
          </div>
          <div className="absolute -bottom-1 -right-1 text-xl animate-ping opacity-50">
            {styles.particles.split('')[3] || '✨'}
          </div>
          {comboType === '4-wide' || comboType === 'mega' ? (
            <>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl animate-spin opacity-30">
                {styles.particles.split('')[4] || '💥'}
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm animate-bounce opacity-40">
                {styles.particles.split('')[5] || '✨'}
              </div>
            </>
          ) : null}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center">
          {/* Combo type label */}
          <div className={`text-xs font-bold mb-1 ${styles.text} ${styles.glow} opacity-90`}>
            {styles.name}
          </div>
          
          {/* Combo count */}
          <div className={`text-4xl font-black ${styles.text} ${styles.glow} leading-none`}>
            {combo}
          </div>
          
          {/* Combo label */}
          <div className={`text-sm font-bold mt-1 ${styles.text} ${styles.glow} opacity-90`}>
            COMBO
          </div>
          
          {/* Special achievement messages */}
          {combo >= 4 && combo < 6 && (
            <div className={`text-xs mt-1 ${styles.text} animate-pulse opacity-90`}>
              NICE!
            </div>
          )}
          
          {combo >= 6 && combo < 8 && (
            <div className={`text-xs mt-1 ${styles.text} animate-pulse font-bold`}>
              GREAT!
            </div>
          )}
          
          {combo >= 8 && combo < 10 && (
            <div className={`text-xs mt-1 ${styles.text} animate-bounce font-bold`}>
              AMAZING!
            </div>
          )}
          
          {combo >= 10 && combo < 12 && (
            <div className={`text-xs mt-1 ${styles.text} animate-bounce font-bold`}>
              INCREDIBLE!
            </div>
          )}
          
          {combo >= 12 && (
            <div className={`text-xs mt-1 ${styles.text} animate-ping font-black`}>
              GODLIKE!
            </div>
          )}
        </div>

        {/* Floating streak indicator */}
        <div className="absolute -top-3 -right-3 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
          <span className="text-black font-bold text-sm">x{combo - 2}</span>
        </div>

        {/* Pulsing border effect */}
        {comboType === 'mega' && (
          <div className="absolute inset-0 rounded-2xl border-4 border-white animate-ping opacity-25"></div>
        )}
      </div>
    </div>
  );
}