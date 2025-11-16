import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TetrominoType, getRandomTetromino, TETROMINOS, resetTetrominoBag } from "../tetris/tetrominos";
import {
  createEmptyBoard,
  isValidPosition,
  placePiece,
  clearLines,
  calculateScore,
  getDropPosition,
  isGameOver,
} from "../tetris/gameLogic";
import { getWallKicks, detectTSpin } from "../tetris/srs";
import { BOARD_WIDTH, LINES_PER_LEVEL } from "../tetris/constants";

export type GameState = "ready" | "playing" | "ended";
export type GameMode = "classic" | "sprint";

interface GameModeConfig {
  mode: GameMode;
  timeLimit?: number; // For sprint mode in seconds
}

interface CurrentPiece {
  type: TetrominoType;
  x: number;
  y: number;
  rotation: number;
}

interface TetrisState {
  // Game state
  gameState: GameState;
  gameMode: GameMode;
  gameConfig: GameModeConfig | null;
  isPaused: boolean;
  isGameOver: boolean;
  
  // Sprint mode specific
  timeRemaining: number; // seconds
  isTimeUp: boolean;
  
  // Game data
  board: (TetrominoType | null)[][];
  currentPiece: CurrentPiece | null;
  nextPiece: TetrominoType | null;
  heldPiece: TetrominoType | null;
  canHold: boolean;
  lastAction: 'rotate' | 'move' | 'drop' | null;
  
  // Stats
  score: number;
  level: number;
  lines: number;
  tspinType: 'none' | 'mini' | 'full';
  combo: number;
  isPerfectClear: boolean;
  
  // Special notifications
  isShowingTetris: boolean;
  lastLinesCleared: number;
  
  // Actions
  startGame: (config?: GameModeConfig) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  resetToReady: () => void;
  setTimeRemaining: (time: number) => void;
  endGameByTime: () => void;
  
  // Piece actions
  movePiece: (direction: "left" | "right" | "down") => void;
  rotatePiece: () => void;
  rotatePieceCounterclockwise: () => void;
  dropPiece: () => void;
  hardDrop: () => void;
  holdPiece: () => void;
  
  // Internal actions
  spawnNextPiece: () => void;
  lockPiece: () => void;
}

export const useTetris = create<TetrisState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    gameState: "ready",
    gameMode: "classic",
    gameConfig: null,
    isPaused: false,
    isGameOver: false,
    timeRemaining: 0,
    isTimeUp: false,
    
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    heldPiece: null,
    canHold: true,
    lastAction: null,
    
    score: 0,
    level: 1,
    lines: 0,
    tspinType: 'none',
    combo: 0,
    isPerfectClear: false,
    isShowingTetris: false,
    lastLinesCleared: 0,
    
    startGame: (config?: GameModeConfig) => {
      const gameConfig = config || { mode: "classic" };
      
      // Reset the randomization bag for a fresh start
      resetTetrominoBag();
      
      set({
        gameState: "playing",
        gameMode: gameConfig.mode,
        gameConfig: gameConfig,
        isPaused: false,
        isGameOver: false,
        isTimeUp: false,
        timeRemaining: gameConfig.timeLimit || 0,
        board: createEmptyBoard(),
        currentPiece: null,
        score: 0,
        level: 1,
        lines: 0,
        nextPiece: getRandomTetromino(),
        heldPiece: null,
        canHold: true,
        lastAction: null,
        tspinType: 'none',
        combo: 0,
        isPerfectClear: false,
        isShowingTetris: false,
        lastLinesCleared: 0,
      });
      
      // Spawn first piece
      setTimeout(() => {
        get().spawnNextPiece();
      }, 100);
    },
    
    pauseGame: () => {
      set({ isPaused: true });
    },
    
    resumeGame: () => {
      set({ isPaused: false });
    },
    
    restartGame: () => {
      const { gameConfig } = get();
      get().startGame(gameConfig || { mode: "classic" });
    },
    
    movePiece: (direction) => {
      const { currentPiece, board, gameState, isPaused } = get();
      
      if (!currentPiece || gameState !== "playing" || isPaused) return;
      
      let newX = currentPiece.x;
      let newY = currentPiece.y;
      
      switch (direction) {
        case "left":
          newX--;
          break;
        case "right":
          newX++;
          break;
        case "down":
          newY++;
          break;
      }
      
      const newPiece = { ...currentPiece, x: newX, y: newY };
      
      if (isValidPosition(board, newPiece)) {
        // Update state all at once to prevent visual glitches
        const scoreIncrease = direction === "down" ? 1 : 0;
        set(state => ({ 
          currentPiece: newPiece,
          lastAction: 'move',
          tspinType: 'none',
          score: state.score + scoreIncrease
        }));
      } else if (direction === "down") {
        // Piece can't move down, lock it
        get().lockPiece();
      }
    },
    
    rotatePiece: () => {
      const { currentPiece, board, gameState, isPaused } = get();
      
      if (!currentPiece || gameState !== "playing" || isPaused) return;
      
      const fromRotation = currentPiece.rotation;
      const toRotation = (currentPiece.rotation + 1) % 4;
      
      // Get SRS wall kick data
      const wallKicks = getWallKicks(currentPiece.type, fromRotation, toRotation);
      
      // Try each wall kick position
      for (let i = 0; i < wallKicks.length; i++) {
        const kick = wallKicks[i];
        const testPiece = {
          ...currentPiece,
          rotation: toRotation,
          x: currentPiece.x + kick.x,
          y: currentPiece.y + kick.y,
        };
        
        if (isValidPosition(board, testPiece)) {
          // Detect T-spin after successful rotation
          const tspinType = detectTSpin(board, testPiece, 'rotate');
          
          set({ 
            currentPiece: testPiece,
            lastAction: 'rotate',
            tspinType
          });
          return;
        }
      }
    },
    
    rotatePieceCounterclockwise: () => {
      const { currentPiece, board, gameState, isPaused } = get();
      
      if (!currentPiece || gameState !== "playing" || isPaused) return;
      
      const fromRotation = currentPiece.rotation;
      const toRotation = (currentPiece.rotation - 1 + 4) % 4;
      
      // Get SRS wall kick data
      const wallKicks = getWallKicks(currentPiece.type, fromRotation, toRotation);
      
      // Try each wall kick position
      for (let i = 0; i < wallKicks.length; i++) {
        const kick = wallKicks[i];
        const testPiece = {
          ...currentPiece,
          rotation: toRotation,
          x: currentPiece.x + kick.x,
          y: currentPiece.y + kick.y,
        };
        
        if (isValidPosition(board, testPiece)) {
          // Detect T-spin after successful counterclockwise rotation
          const tspinType = detectTSpin(board, testPiece, 'rotate');
          
          if (currentPiece.type === "T" && tspinType !== 'none') {
            console.log(`T-spin ${tspinType.toUpperCase()} detected!`);
          }
          
          set({ 
            currentPiece: testPiece,
            lastAction: 'rotate',
            tspinType
          });
          return;
        }
      }
    },
    
    dropPiece: () => {
      get().movePiece("down");
    },
    
    hardDrop: () => {
      const { currentPiece, board } = get();
      
      if (!currentPiece) return;
      
      const dropY = getDropPosition(board, currentPiece);
      const dropDistance = dropY - currentPiece.y;
      
      set({
        currentPiece: { ...currentPiece, y: dropY },
        score: get().score + (dropDistance * 2),
        lastAction: 'drop',
        tspinType: 'none'
      });
      
      // Lock the piece immediately
      setTimeout(() => {
        get().lockPiece();
      }, 50);
    },
    
    holdPiece: () => {
      const { currentPiece, heldPiece, canHold, gameState, isPaused } = get();
      
      if (!currentPiece || !canHold || gameState !== "playing" || isPaused) return;
      
      if (heldPiece === null) {
        // First time holding - store current piece and spawn next
        set({
          heldPiece: currentPiece.type,
          currentPiece: null,
          canHold: false,
        });
        get().spawnNextPiece();
      } else {
        // Swap current piece with held piece
        const newPiece: CurrentPiece = {
          type: heldPiece,
          x: Math.floor(BOARD_WIDTH / 2) - 1,
          y: 0,
          rotation: 0,
        };
        
        set({
          heldPiece: currentPiece.type,
          currentPiece: newPiece,
          canHold: false,
        });
      }
    },
    
    spawnNextPiece: () => {
      const { nextPiece, board } = get();
      
      if (!nextPiece) return;
      
      // Standard Tetris spawn position (row 0, centered)
      const newPiece: CurrentPiece = {
        type: nextPiece,
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: 0,
        rotation: 0,
      };
      
      // Check if piece can spawn at standard position
      if (isValidPosition(board, newPiece)) {
        set({
          currentPiece: newPiece,
          nextPiece: getRandomTetromino(),
        });
        return;
      }
      
      // Try one position above (common in modern Tetris)
      const newPieceAbove: CurrentPiece = {
        type: nextPiece,
        x: Math.floor(BOARD_WIDTH / 2) - 1,
        y: -1,
        rotation: 0,
      };
      
      if (isValidPosition(board, newPieceAbove)) {
        set({
          currentPiece: newPieceAbove,
          nextPiece: getRandomTetromino(),
        });
        return;
      }
      
      // If we can't spawn at standard positions, game over
      set({
        gameState: "ended",
        isGameOver: true,
        currentPiece: null,
      });
    },
    
    lockPiece: () => {
      const { currentPiece, board, tspinType, combo } = get();
      
      if (!currentPiece) return;
      
      // Place the piece on the board
      const newBoard = placePiece(board, currentPiece);
      
      // Clear any complete lines
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      // Check for perfect clear (entire board is empty after line clear)
      const isPerfectClear = linesCleared > 0 && clearedBoard.every(row => row.every(cell => cell === null));
      
      // Update combo system
      let newCombo = combo;
      if (linesCleared > 0) {
        newCombo = combo + 1;
      } else {
        newCombo = 0; // Reset combo if no lines cleared
      }
      
      // Calculate enhanced score with T-spin bonuses
      const { level } = get();
      let points = calculateScore(linesCleared, level);
      
      // Combo bonus (starts affecting score after 3rd consecutive line clear)
      if (linesCleared > 0 && newCombo >= 3) {
        const comboMultiplier = Math.min(newCombo - 2, 10); // Cap at 10x multiplier
        const comboBonus = Math.floor(50 * comboMultiplier * level);
        points += comboBonus;
      }
      
      // Perfect clear bonus (massive point bonus)
      if (isPerfectClear) {
        const perfectClearBonus = Math.floor(1000 * level + (linesCleared * 500));
        points += perfectClearBonus;
      }
      
      // T-spin bonus scoring
      if (tspinType !== 'none' && linesCleared > 0) {
        const basePoints = [100, 300, 500, 800]; // T-spin base points for 1-4 lines
        const tspinMultiplier = tspinType === 'full' ? 1 : 0.5; // Mini T-spins are worth half
        
        if (linesCleared <= 4) {
          const bonus = Math.floor(basePoints[linesCleared - 1] * tspinMultiplier * level);
          points += bonus;
        }
      } else if (tspinType !== 'none' && linesCleared === 0) {
        // T-spin without line clear still awards small bonus
        const bonus = 100 * level;
        points += bonus;
      }
      
      // Check for Tetris (4-line clear)
      const isTetris = linesCleared === 4;
      
      // Update state
      const newLines = get().lines + linesCleared;
      const newLevel = Math.floor(newLines / LINES_PER_LEVEL) + 1;
      
      set({
        board: clearedBoard,
        currentPiece: null,
        score: get().score + points,
        lines: newLines,
        level: newLevel,
        tspinType: 'none',
        lastAction: null,
        combo: newCombo,
        isPerfectClear: isPerfectClear,
        isShowingTetris: isTetris,
        lastLinesCleared: linesCleared,
      });
      
      // Reset hold ability
      set({ canHold: true });
      
      // Hide Tetris notification after delay
      if (isTetris) {
        setTimeout(() => {
          set({ isShowingTetris: false });
        }, 1500); // Show for 1.5 seconds
      }
      
      // Spawn next piece immediately for perfect clears and T-spins, with small delay for others
      if (isPerfectClear) {
        // For perfect clears, spawn immediately to avoid delay
        setTimeout(() => {
          get().spawnNextPiece();
        }, 50);
        
        // Reset perfect clear flag after notification time
        setTimeout(() => {
          set({ isPerfectClear: false });
        }, 2500);
      } else if (tspinType !== 'none') {
        // For T-spins, spawn immediately for better flow
        setTimeout(() => {
          get().spawnNextPiece();
        }, 30); // Minimal delay for T-spins
      } else {
        // Normal delay for regular piece placement
        setTimeout(() => {
          get().spawnNextPiece();
        }, 100);
      }
    },

    setTimeRemaining: (time: number) => {
      set({ timeRemaining: time });
      
      // End game if time runs out in sprint mode
      if (time <= 0 && get().gameMode === 'sprint') {
        get().endGameByTime();
      }
    },

    endGameByTime: () => {
      set({
        gameState: "ended",
        isTimeUp: true,
        isPaused: false,
      });
    },

    resetToReady: () => {
      set({
        gameState: "ready",
        gameMode: "classic",
        gameConfig: null,
        isPaused: false,
        isGameOver: false,
        isTimeUp: false,
        timeRemaining: 0,
        board: createEmptyBoard(),
        currentPiece: null,
        nextPiece: null,
        heldPiece: null,
        canHold: true,
        lastAction: null,
        score: 0,
        level: 1,
        lines: 0,
        tspinType: 'none',
        combo: 0,
        isPerfectClear: false,
        isShowingTetris: false,
        lastLinesCleared: 0,
      });
    },
  }))
);
