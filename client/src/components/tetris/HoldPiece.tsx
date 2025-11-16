import React from "react";
import { TetrominoType } from "../../lib/tetris/tetrominos";

interface HoldPieceProps {
  piece: TetrominoType | null;
  canHold: boolean;
}

// Ocean-themed colors matching the main board
const TETROMINO_COLORS = {
  I: "#40E0D0", // Turquoise
  O: "#FFD700", // Gold
  T: "#FF7F50", // Coral
  S: "#32CD32", // Lime green
  Z: "#FF6347", // Tomato red
  J: "#4169E1", // Royal blue
  L: "#DA70D6", // Orchid
};

const HoldPiece: React.FC<HoldPieceProps> = ({ piece, canHold }) => {
  return (
    <div className="p-3 rounded-lg w-full max-w-[140px] z-10 relative"
         style={{
           background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.4), rgba(12, 24, 41, 0.6))',
           border: '2px solid rgba(64, 224, 208, 0.3)',
           boxShadow: '0 0 15px rgba(64, 224, 208, 0.2)',
           backdropFilter: 'blur(5px)',
         }}>
      <h3 className="text-sm font-semibold mb-2 text-center pb-1 text-cyan-200"
          style={{ 
            textShadow: '0 0 5px rgba(64, 224, 208, 0.6)',
            borderBottom: '1px solid rgba(64, 224, 208, 0.3)'
          }}>
        🫧 Hold {!canHold && <span className="text-cyan-400">(Used)</span>}
      </h3>
      
      <div className="flex justify-center">
        <div 
          className="grid gap-px p-2 rounded"
          style={{
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(4, 1fr)",
            background: 'rgba(12, 24, 41, 0.5)',
            opacity: canHold ? 1 : 0.5,
          }}
        >
          {Array.from({ length: 16 }).map((_, index) => {
            const x = index % 4;
            const y = Math.floor(index / 4);
            
            // Simple preview for different pieces
            let shouldFill = false;
            if (piece) {
              switch (piece) {
                case "I":
                  shouldFill = y === 1 && x >= 0 && x < 4;
                  break;
                case "O":
                  shouldFill = x >= 1 && x < 3 && y >= 1 && y < 3;
                  break;
                case "T":
                  shouldFill = (y === 1 && x >= 0 && x < 3) || (y === 2 && x === 1);
                  break;
                case "S":
                  shouldFill = (y === 1 && x >= 1 && x < 3) || (y === 2 && x >= 0 && x < 2);
                  break;
                case "Z":
                  shouldFill = (y === 1 && x >= 0 && x < 2) || (y === 2 && x >= 1 && x < 3);
                  break;
                case "J":
                  shouldFill = (y === 1 && x >= 0 && x < 3) || (y === 2 && x === 2);
                  break;
                case "L":
                  shouldFill = (y === 1 && x >= 0 && x < 3) || (y === 2 && x === 0);
                  break;
              }
            }
            
            return (
              <div
                key={index}
                className="w-4 h-4 rounded-sm"
                style={{
                  backgroundColor: shouldFill && piece ? TETROMINO_COLORS[piece] : "rgba(12, 24, 41, 0.3)",
                  border: shouldFill && piece ? `1px solid ${TETROMINO_COLORS[piece]}` : "1px solid rgba(64, 224, 208, 0.1)",
                  boxShadow: shouldFill && piece ? `0 0 8px rgba(64, 224, 208, 0.3)` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
      
      <div className="mt-2 text-center text-sm text-cyan-300"
           style={{ textShadow: '0 0 3px rgba(64, 224, 208, 0.4)' }}>
        Press C to hold
      </div>
    </div>
  );
};

export default HoldPiece;