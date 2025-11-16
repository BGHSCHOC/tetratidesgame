import React from "react";
import { GameState } from "../../lib/stores/useTetris";

interface TetrisControlsProps {
  gameState: GameState;
  isPaused: boolean;
  onStartGame: () => void;
  onPauseToggle: () => void;
  onRestartGame: () => void;
  onShowControls: () => void;
}

const TetrisControls: React.FC<TetrisControlsProps> = ({
  gameState,
  isPaused,
  onStartGame,
  onPauseToggle,
  onRestartGame,
  onShowControls,
}) => {
  return (
    <div 
      className="p-4 rounded-lg h-fit"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.4), rgba(12, 24, 41, 0.6))',
        border: '1px solid rgba(64, 224, 208, 0.3)',
        boxShadow: '0 0 15px rgba(64, 224, 208, 0.2)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <h3 
        className="text-lg font-semibold mb-3 text-center pb-2 text-cyan-200"
        style={{ 
          borderBottom: '1px solid rgba(64, 224, 208, 0.3)',
          textShadow: '0 0 5px rgba(64, 224, 208, 0.6)'
        }}
      >
Ocean Controls
      </h3>
      
      <div className="space-y-2 mb-4 text-xs">
        {/* Movement Keys */}
        <div>
          <div className="text-cyan-300 text-center mb-1">Navigate</div>
          <div className="flex justify-center gap-1">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">←</span>
            </div>
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">↓</span>
            </div>
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">→</span>
            </div>
          </div>
        </div>

        {/* Rotation Keys */}
        <div>
          <div className="text-cyan-300 text-center mb-1">Coral Spin</div>
          <div className="flex justify-center gap-1">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">↑</span>
            </div>
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">Z</span>
            </div>
          </div>
        </div>

        {/* Other Keys */}
        <div className="flex justify-center gap-2">
          <div className="text-center">
            <div className="text-cyan-300 mb-1">Hold</div>
            <div 
              className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">C</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-cyan-300 mb-1">Drop</div>
            <div 
              className="w-10 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">Space</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-cyan-300 mb-1">Pause</div>
            <div 
              className="w-8 h-6 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.7), rgba(12, 24, 41, 0.9))',
                border: '1px solid rgba(64, 224, 208, 0.5)',
                boxShadow: '0 0 4px rgba(64, 224, 208, 0.3)',
              }}
            >
              <span className="font-mono text-cyan-200 font-bold text-xs">Esc</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {gameState === "ready" && (
          <button
            onClick={onStartGame}
            className="w-full py-2 px-3 rounded font-semibold text-sm transition-all duration-200 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8))',
              border: '1px solid rgba(64, 224, 208, 0.4)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8))';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.3)';
            }}
          >
            Start Game
          </button>
        )}
        
        {gameState === "playing" && (
          <button
            onClick={onPauseToggle}
            className="w-full py-2 px-3 rounded font-semibold text-sm transition-all duration-200 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.8))',
              border: '1px solid rgba(64, 224, 208, 0.4)',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 1), rgba(217, 119, 6, 1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(245, 158, 11, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.8))';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(245, 158, 11, 0.3)';
            }}
          >
            {isPaused ? "Resume Dive" : "Pause Dive"}
          </button>
        )}
        
        {gameState === "ended" && (
          <button
            onClick={onStartGame}
            className="w-full py-2 px-3 rounded font-semibold text-sm transition-all duration-200 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8))',
              border: '1px solid rgba(64, 224, 208, 0.4)',
              boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.8))';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.3)';
            }}
          >
            Dive Again
          </button>
        )}
        
        {gameState !== "ready" && (
          <button
            onClick={onRestartGame}
            className="w-full py-2 px-3 rounded font-semibold text-sm transition-all duration-200 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))',
              border: '1px solid rgba(64, 224, 208, 0.4)',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 1), rgba(220, 38, 38, 1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.8), rgba(220, 38, 38, 0.8))';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(239, 68, 68, 0.3)';
            }}
          >
            Restart Ocean
          </button>
        )}
        
        <button
          onClick={onShowControls}
          className="w-full py-2 px-3 rounded font-semibold text-sm transition-all duration-200 text-white"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(126, 34, 206, 0.8))',
            border: '1px solid rgba(64, 224, 208, 0.4)',
            boxShadow: '0 0 10px rgba(147, 51, 234, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 1), rgba(126, 34, 206, 1))';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(147, 51, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(126, 34, 206, 0.8))';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(147, 51, 234, 0.3)';
          }}
        >
          Customize Controls
        </button>
      </div>
    </div>
  );
};

export default TetrisControls;
