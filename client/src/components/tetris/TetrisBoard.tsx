import React from "react";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../../lib/tetris/constants";
import { TetrominoType, getTetrominoShape } from "../../lib/tetris/tetrominos";
import { getDropPosition } from "../../lib/tetris/gameLogic";

interface TetrisBoardProps {
  board: (TetrominoType | null)[][];
  currentPiece: {
    type: TetrominoType;
    x: number;
    y: number;
    rotation: number;
  } | null;
  isGameOver: boolean;
  isPaused: boolean;
}

// Ocean-themed colors for tetromino pieces (coral and sea life inspired)
const TETROMINO_COLORS = {
  I: "#40E0D0", // Turquoise (like tropical waters)
  O: "#FFD700", // Gold (like sea treasure)
  T: "#FF7F50", // Coral (like living coral)
  S: "#32CD32", // Lime green (like sea grass)
  Z: "#FF6347", // Tomato red (like sea anemone)
  J: "#4169E1", // Royal blue (like deep ocean)
  L: "#DA70D6", // Orchid (like sea urchin)
};

// Ocean-themed glow effects for pieces
const TETROMINO_GLOW = {
  I: "0 0 15px rgba(64, 224, 208, 0.6)",
  O: "0 0 15px rgba(255, 215, 0, 0.6)",
  T: "0 0 15px rgba(255, 127, 80, 0.6)",
  S: "0 0 15px rgba(50, 205, 50, 0.6)",
  Z: "0 0 15px rgba(255, 99, 71, 0.6)",
  J: "0 0 15px rgba(65, 105, 225, 0.6)",
  L: "0 0 15px rgba(218, 112, 214, 0.6)",
};

const TetrisBoard: React.FC<TetrisBoardProps> = ({ 
  board, 
  currentPiece, 
  isGameOver, 
  isPaused 
}) => {
  // Create render data structure
  const cellData = Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null).map(() => ({
      piece: null as TetrominoType | null,
      isGhost: false,
      isCurrent: false
    }))
  );
  
  // Fill with board state first
  for (let y = 0; y < BOARD_HEIGHT; y++) {
    for (let x = 0; x < BOARD_WIDTH; x++) {
      cellData[y][x].piece = board[y][x];
    }
  }
  
  // Add ghost piece (rendered first, so current piece can overlap)
  if (currentPiece) {
    const ghostY = getDropPosition(board, currentPiece);
    const shape = getTetrominoShape(currentPiece.type, currentPiece.rotation);
    
    // Only show ghost if it's different from current position AND below it
    if (ghostY > currentPiece.y) {
      for (let dy = 0; dy < shape.length; dy++) {
        for (let dx = 0; dx < shape[dy].length; dx++) {
          if (shape[dy][dx]) {
            const boardX = currentPiece.x + dx;
            const boardY = ghostY + dy;
            if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
              if (!cellData[boardY][boardX].piece) { // Only show ghost in empty cells
                cellData[boardY][boardX].piece = currentPiece.type;
                cellData[boardY][boardX].isGhost = true;
              }
            }
          }
        }
      }
    }
  }
  
  // Add current piece (overlaps ghost)
  if (currentPiece) {
    const { type, x, y, rotation } = currentPiece;
    const shape = getTetrominoShape(type, rotation);
    
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[dy].length; dx++) {
        if (shape[dy][dx]) {
          const boardX = x + dx;
          const boardY = y + dy;
          if (boardX >= 0 && boardX < BOARD_WIDTH && boardY >= 0 && boardY < BOARD_HEIGHT) {
            cellData[boardY][boardX].piece = type;
            cellData[boardY][boardX].isGhost = false; // Current piece always overrides ghost
            cellData[boardY][boardX].isCurrent = true;
          }
        }
      }
    }
  }

  return (
    <div className="relative z-10">
      <div 
        className="grid gap-px p-4 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
          background: 'linear-gradient(180deg, rgba(30, 60, 114, 0.3) 0%, rgba(12, 24, 41, 0.5) 100%)',
          border: '2px solid rgba(64, 224, 208, 0.3)',
          boxShadow: '0 0 30px rgba(64, 224, 208, 0.2), inset 0 0 30px rgba(12, 24, 41, 0.4)',
          backdropFilter: 'blur(5px)',
        }}
      >
        {cellData.map((row, y) =>
          row.map((cell, x) => {
            const { piece, isGhost, isCurrent } = cell;
            
            let backgroundColor = "rgba(12, 24, 41, 0.3)"; // Default ocean depth
            let opacity = 1;
            let border = "1px solid rgba(64, 224, 208, 0.1)"; // Subtle aqua border
            let boxShadow = "none";
            let borderRadius = "3px";
            
            if (piece) {
              backgroundColor = TETROMINO_COLORS[piece];
              boxShadow = TETROMINO_GLOW[piece];
              
              if (isGhost) {
                // Ghost piece styling - transparent with aqua glow
                opacity = 0.4;
                border = `1px dashed ${TETROMINO_COLORS[piece]}`;
                boxShadow = `0 0 8px rgba(64, 224, 208, 0.3)`;
                backgroundColor = `rgba(64, 224, 208, 0.1)`;
              } else if (isCurrent) {
                // Current piece gets full glow and coral-like appearance
                opacity = 0.9;
                border = `1px solid ${TETROMINO_COLORS[piece]}`;
                boxShadow = `${TETROMINO_GLOW[piece]}, inset 0 0 10px rgba(255, 255, 255, 0.1)`;
              } else {
                // Locked pieces have subtle glow
                opacity = 0.8;
                border = `1px solid ${TETROMINO_COLORS[piece]}`;
                boxShadow = `0 0 8px rgba(64, 224, 208, 0.2)`;
              }
            }
            
            return (
              <div
                key={`${x}-${y}`}
                className="w-8 h-8 transition-all duration-200"
                style={{
                  backgroundColor,
                  opacity,
                  border,
                  boxShadow,
                  borderRadius,
                  backdropFilter: piece ? 'blur(1px)' : 'none',
                }}
              />
            );
          })
        )}
      </div>
      
      {/* Game state overlays with ocean theme */}
      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 flex items-center justify-center z-20"
             style={{
               background: 'rgba(12, 24, 41, 0.8)',
               backdropFilter: 'blur(10px)',
             }}>
          <div className="text-center p-6 rounded-lg"
               style={{
                 background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.4), rgba(12, 24, 41, 0.6))',
                 border: '2px solid rgba(64, 224, 208, 0.5)',
                 boxShadow: '0 0 30px rgba(64, 224, 208, 0.3)',
               }}>
            <h2 className="text-3xl font-bold text-cyan-200 mb-2"
                style={{ textShadow: '0 0 10px rgba(64, 224, 208, 0.8)' }}>
              {isGameOver ? "🌊 TETRATIDES CONQUERED 🌊" : "⏸️ TIDE PAUSED ⏸️"}
            </h2>
            <p className="text-cyan-300 text-sm">
              {isGameOver ? "The ocean awaits your return..." : "The current flows gently..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TetrisBoard;
