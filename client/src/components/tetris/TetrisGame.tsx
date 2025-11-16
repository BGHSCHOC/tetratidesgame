import React, { useEffect, useCallback, useState } from "react";
import { useTetris, GameMode } from "../../lib/stores/useTetris";
import { useAudio } from "../../lib/stores/useAudio";
import { useControls } from "../../lib/stores/useControls";
import TetrisBoard from "./TetrisBoard";
import TetrisUI from "./TetrisUI";
import TetrisControls from "./TetrisControls";
import NextPiece from "./NextPiece";
import HoldPiece from "./HoldPiece";
import ControlSettings from "./ControlSettings";
import { ComboBubble } from "./ComboBubble";
import { SprintTimer } from "./SprintTimer";
import { TetrisNotification } from "./TetrisNotification";
import { Button } from "../ui/button";
import { Home } from "lucide-react";

interface GameModeConfig {
  mode: GameMode;
  timeLimit?: number;
}

interface TetrisGameProps {
  gameConfig?: GameModeConfig | null;
  onBackToHome?: () => void;
}

const TetrisGame: React.FC<TetrisGameProps> = ({ gameConfig, onBackToHome }) => {
  const {
    gameState,
    gameMode,
    board,
    currentPiece,
    nextPiece,
    heldPiece,
    canHold,
    score,
    level,
    lines,
    tspinType,
    combo,
    isPerfectClear,
    isShowingTetris,
    isGameOver,
    isPaused,
    timeRemaining,
    isTimeUp,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    resetToReady,
    movePiece,
    rotatePiece,
    rotatePieceCounterclockwise,
    dropPiece,
    hardDrop,
    holdPiece,
    setTimeRemaining,
  } = useTetris();

  const { playHit, playSuccess } = useAudio();
  const { keyBindings, setKeyBindings } = useControls();
  const [showControls, setShowControls] = useState(false);

  const handleBackToHome = () => {
    resetToReady();
    if (onBackToHome) {
      onBackToHome();
    }
  };

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Handle pause at any time during gameplay
    if (event.code === keyBindings.pause && (gameState === "playing")) {
      event.preventDefault();
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
      return;
    }

    if (gameState !== "playing" || isPaused) return;

    switch (event.code) {
      case keyBindings.moveLeft:
        event.preventDefault();
        movePiece("left");
        break;
      case keyBindings.moveRight:
        event.preventDefault();
        movePiece("right");
        break;
      case keyBindings.moveDown:
        event.preventDefault();
        movePiece("down");
        break;
      case keyBindings.rotate:
        event.preventDefault();
        rotatePiece();
        playHit();
        break;
      case keyBindings.rotateCounterclockwise:
        event.preventDefault();
        rotatePieceCounterclockwise();
        playHit();
        break;
      case keyBindings.hardDrop:
        event.preventDefault();
        hardDrop();
        playSuccess();
        break;
      case keyBindings.hold:
        event.preventDefault();
        holdPiece();
        break;
    }
  }, [gameState, isPaused, keyBindings, movePiece, rotatePiece, rotatePieceCounterclockwise, hardDrop, holdPiece, playHit, playSuccess, pauseGame, resumeGame]);

  // Reset and initialize game when config changes
  useEffect(() => {
    if (gameConfig) {
      resetToReady();
      // Small delay to ensure state is reset before starting
      setTimeout(() => {
        startGame(gameConfig);
      }, 10);
    }
  }, [gameConfig, resetToReady, startGame]);

  // Sprint mode timer
  useEffect(() => {
    if (gameMode === 'sprint' && gameState === 'playing' && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameMode, gameState, isPaused, timeRemaining, setTimeRemaining]);

  // Game controls
  const handleStartGame = () => {
    if (gameState === "ready") {
      startGame(gameConfig || { mode: "classic" });
    } else if (isGameOver || isTimeUp) {
      restartGame();
    }
  };

  const handlePauseToggle = () => {
    if (gameState === "playing") {
      if (isPaused) {
        resumeGame();
      } else {
        pauseGame();
      }
    }
  };

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  // Auto-drop pieces
  useEffect(() => {
    if (gameState === "playing" && !isPaused) {
      const dropInterval = Math.max(50, 1000 - (level * 50));
      const interval = setInterval(() => {
        dropPiece();
      }, dropInterval);

      return () => clearInterval(interval);
    }
  }, [gameState, isPaused, level, dropPiece]);

  return (
    <div className="flex flex-col items-center bg-gray-900 text-white p-2 lg:p-4 min-h-screen">
      {/* Header with Home Button */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-4 lg:mb-6 px-2">
        {onBackToHome && (
          <button
            onClick={handleBackToHome}
            className="flex items-center px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-semibold text-sm lg:text-base transition-all duration-200 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(12, 24, 41, 0.8))',
              border: '1px solid rgba(64, 224, 208, 0.3)',
              boxShadow: '0 0 10px rgba(64, 224, 208, 0.2)',
              backdropFilter: 'blur(3px)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 60, 114, 1), rgba(12, 24, 41, 1))';
              e.currentTarget.style.boxShadow = '0 0 15px rgba(64, 224, 208, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(30, 60, 114, 0.8), rgba(12, 24, 41, 0.8))';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(64, 224, 208, 0.2)';
            }}
          >
            <Home className="h-4 w-4 mr-1 lg:mr-2" />
            🌊 Surface 🌊
          </button>
        )}
        
        <h1 
          className="text-2xl lg:text-5xl font-bold text-center flex-1 text-cyan-200"
          style={{ textShadow: '0 0 15px rgba(64, 224, 208, 0.8)' }}
        >
          🌊 TETRATIDES 🌊
          {gameMode === 'sprint' && (
            <span className="text-sm lg:text-xl text-cyan-300 block">Tidal Rush Mode</span>
          )}
        </h1>
        
        <div className="w-16 lg:w-20"> {/* Spacer for symmetry */}</div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start justify-center max-w-7xl w-full px-2">
        {/* Left Side: Hold and Next Pieces */}
        <div className="hidden lg:flex flex-col gap-4 lg:min-w-[140px] items-start">
          <HoldPiece piece={heldPiece} canHold={canHold} />
          <NextPiece piece={nextPiece} />
        </div>
        
        {/* Game Board */}
        <div className="flex flex-col items-center relative lg:flex-shrink-0 w-full lg:w-auto">
          <TetrisBoard 
            board={board} 
            currentPiece={currentPiece} 
            isGameOver={isGameOver}
            isPaused={isPaused}
          />
          
          {/* Tetris Notification */}
          <TetrisNotification isVisible={isShowingTetris} />
          
          {/* Game State Overlay */}
          {gameState === "ready" && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div 
                className="rounded-xl p-8 text-center shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.9), rgba(12, 24, 41, 0.95))',
                  border: '1px solid rgba(64, 224, 208, 0.4)',
                  boxShadow: '0 0 25px rgba(64, 224, 208, 0.3)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <h2 
                  className="text-3xl font-bold mb-4 text-cyan-200"
                  style={{ textShadow: '0 0 10px rgba(64, 224, 208, 0.8)' }}
                >
                  🌊 Ready to Dive? 🌊
                </h2>
                {gameMode === 'sprint' && gameConfig && (
                  <p className="text-cyan-300 mb-4 text-lg">
                    Tidal Rush Mode - {Math.floor(gameConfig.timeLimit / 60)}:{(gameConfig.timeLimit % 60).toString().padStart(2, '0')}
                  </p>
                )}
                <button
                  onClick={handleStartGame}
                  className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                    border: '1px solid rgba(64, 224, 208, 0.4)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1))';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.4)';
                  }}
                >
                  🌊 Begin Ocean Dive 🌊
                </button>
              </div>
            </div>
          )}
          
          {isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div 
                className="rounded-xl p-8 text-center shadow-2xl"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.9), rgba(12, 24, 41, 0.95))',
                  border: '1px solid rgba(64, 224, 208, 0.4)',
                  boxShadow: '0 0 25px rgba(64, 224, 208, 0.3)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <h2 
                  className="text-3xl font-bold mb-4 text-cyan-200"
                  style={{ textShadow: '0 0 10px rgba(64, 224, 208, 0.8)' }}
                >
                  ⏸️ OCEAN PAUSED ⏸️
                </h2>
                <p className="text-cyan-300 mb-6 text-lg">Press ESC or click Resume to continue your dive</p>
                <button
                  onClick={handlePauseToggle}
                  className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                    border: '1px solid rgba(64, 224, 208, 0.4)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1))';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))';
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.4)';
                  }}
                >
                  🌊 Resume Dive 🌊
                </button>
              </div>
            </div>
          )}
          
          {(isGameOver || isTimeUp) && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
              <div 
                className="rounded-xl p-8 text-center shadow-2xl max-w-md"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.9), rgba(12, 24, 41, 0.95))',
                  border: '1px solid rgba(64, 224, 208, 0.4)',
                  boxShadow: '0 0 25px rgba(64, 224, 208, 0.3)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <h2 
                  className="text-3xl font-bold mb-6 text-cyan-200"
                  style={{ textShadow: '0 0 10px rgba(64, 224, 208, 0.8)' }}
                >
                  {isTimeUp ? '⏰ TIDE ENDS!' : '🌊 OCEAN DEPTHS CLAIMED YOU!'}
                </h2>
                <div className="mb-6 space-y-3 text-lg">
                  <div 
                    className="rounded p-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <p className="text-yellow-300 font-semibold">🏆 Final Score: {score.toLocaleString()}</p>
                  </div>
                  <div 
                    className="rounded p-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <p className="text-blue-300 font-semibold">🗲 Lines Cleared: {lines}</p>
                  </div>
                  {gameMode === 'sprint' && gameConfig && (
                    <div 
                      className="rounded p-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                        border: '1px solid rgba(64, 224, 208, 0.3)',
                      }}
                    >
                      <p className="text-cyan-300 font-semibold">
                        ⚡ Lines Per Minute: {Math.round((lines / (gameConfig.timeLimit / 60)))}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleStartGame}
                    className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 w-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))',
                      border: '1px solid rgba(64, 224, 208, 0.4)',
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 1), rgba(16, 185, 129, 1))';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(16, 185, 129, 0.9))';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(34, 197, 94, 0.4)';
                    }}
                  >
                    🔄 Dive Again 🔄
                  </button>
                  {onBackToHome && (
                    <button
                      onClick={handleBackToHome}
                      className="px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 w-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.9), rgba(75, 85, 99, 0.9))',
                        border: '1px solid rgba(64, 224, 208, 0.4)',
                        boxShadow: '0 0 15px rgba(107, 114, 128, 0.4)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 1), rgba(75, 85, 99, 1))';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(107, 114, 128, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(107, 114, 128, 0.9), rgba(75, 85, 99, 0.9))';
                        e.currentTarget.style.boxShadow = '0 0 15px rgba(107, 114, 128, 0.4)';
                      }}
                    >
                      🏠 Return to Surface 🏠
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Side Panel */}
        <div className="flex flex-col gap-4 lg:gap-6 lg:max-w-2xl w-full lg:w-auto lg:min-w-[320px]">
          {/* Sprint Timer */}
          <SprintTimer 
            timeRemaining={timeRemaining} 
            totalTime={gameConfig?.timeLimit || 120}
            isVisible={gameMode === 'sprint' && gameState === 'playing'} 
          />
          
          {/* Game Info and Controls Row */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Left Column: Game Stats */}
            <div className="flex flex-col gap-4 lg:gap-6 flex-1">
              <TetrisUI score={score} level={level} lines={lines} tspinType={tspinType} combo={combo} isPerfectClear={isPerfectClear} />
              
              {/* Mobile: Show Hold and Next pieces for smaller screens */}
              <div className="flex lg:hidden gap-4">
                <HoldPiece piece={heldPiece} canHold={canHold} />
                <NextPiece piece={nextPiece} />
              </div>
            </div>
            
            {/* Right Column: Controls */}
            <div className="flex flex-col gap-4 lg:gap-6 lg:min-w-[200px]">
              <TetrisControls 
                gameState={gameState}
                isPaused={isPaused}
                onStartGame={handleStartGame}
                onPauseToggle={handlePauseToggle}
                onRestartGame={restartGame}
                onShowControls={() => setShowControls(true)}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Combo Bubble */}
      <ComboBubble combo={combo} isVisible={gameState === "playing" && combo >= 3} />
      
      {/* Control Settings Modal */}
      <ControlSettings
        isOpen={showControls}
        onClose={() => setShowControls(false)}
        keyBindings={keyBindings}
        onSave={setKeyBindings}
      />
    </div>
  );
};

export default TetrisGame;
