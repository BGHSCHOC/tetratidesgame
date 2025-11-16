// Super Rotation System (SRS) implementation for modern Tetris
// Enables T-spins and advanced rotation mechanics

import { TetrominoType } from "./tetrominos";

export interface WallKickData {
  x: number;
  y: number;
}

// SRS Wall Kick Data Tables
// For JLSTZ pieces (most pieces use this table)
const JLSTZ_WALL_KICKS: Record<string, WallKickData[]> = {
  // 0->1 (0° to 90°)
  "0->1": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  // 1->0 (90° to 0°)
  "1->0": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  // 1->2 (90° to 180°)
  "1->2": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  // 2->1 (180° to 90°)
  "2->1": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  // 2->3 (180° to 270°)
  "2->3": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  // 3->2 (270° to 180°)
  "3->2": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  // 3->0 (270° to 0°)
  "3->0": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
  // 0->3 (0° to 270° CCW) - Modified for T-spin compatibility
  "0->3": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
};



// I piece has its own special wall kick table
const I_WALL_KICKS: Record<string, WallKickData[]> = {
  // 0->1 (0° to 90°)
  "0->1": [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  // 1->0 (90° to 0°)
  "1->0": [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  // 1->2 (90° to 180°)
  "1->2": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
  // 2->1 (180° to 90°)
  "2->1": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  // 2->3 (180° to 270°)
  "2->3": [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  // 3->2 (270° to 180°)
  "3->2": [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  // 3->0 (270° to 0°)
  "3->0": [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
  // 0->3 (0° to 270°)
  "0->3": [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
};

// O piece doesn't rotate, so no wall kicks needed

export function getWallKicks(
  pieceType: TetrominoType,
  fromRotation: number,
  toRotation: number
): WallKickData[] {
  // O piece doesn't rotate
  if (pieceType === "O") {
    return [{ x: 0, y: 0 }];
  }

  const key = `${fromRotation}->${toRotation}`;
  
  if (pieceType === "I") {
    return I_WALL_KICKS[key] || [{ x: 0, y: 0 }];
  } else {
    return JLSTZ_WALL_KICKS[key] || [{ x: 0, y: 0 }];
  }
}

// T-Spin detection based on proper SRS rules
export function detectTSpin(
  board: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number },
  lastAction: 'rotate' | 'move' | 'drop'
): 'none' | 'mini' | 'full' {
  if (piece.type !== "T" || lastAction !== 'rotate') {
    return 'none';
  }

  // Find the T piece center by looking at the actual shape
  // T piece has a consistent center at (1,1) in its 3x3 grid
  const centerX = piece.x + 1;
  const centerY = piece.y + 1;

  // Define the 4 corners around the center
  const corners = [
    { x: centerX - 1, y: centerY - 1 }, // Top-left
    { x: centerX + 1, y: centerY - 1 }, // Top-right
    { x: centerX - 1, y: centerY + 1 }, // Bottom-left
    { x: centerX + 1, y: centerY + 1 }, // Bottom-right
  ];

  // Count filled corners
  let filledCorners = 0;
  let frontCornersFilled = 0;
  const cornerNames = ['Top-left', 'Top-right', 'Bottom-left', 'Bottom-right'];

  corners.forEach((corner, index) => {
    // Check if corner is filled (out of bounds counts as filled)
    const isOutOfBounds = 
      corner.x < 0 || corner.x >= 10 || 
      corner.y < 0 || corner.y >= 20;
    
    const hasBlock = !isOutOfBounds && 
      corner.y >= 0 && corner.y < 20 && 
      corner.x >= 0 && corner.x < 10 && 
      board[corner.y] && board[corner.y][corner.x] !== null;
    
    const isFilled = isOutOfBounds || hasBlock;
    
    if (isFilled) {
      filledCorners++;
      
      // Determine front corners based on T piece orientation
      // Front corners are the ones "in front of" the T piece's stem
      const isFrontCorner = (
        (piece.rotation === 0 && (index === 0 || index === 1)) || // 0°: top corners (stem points up)
        (piece.rotation === 1 && (index === 1 || index === 3)) || // 90°: right corners (stem points right)
        (piece.rotation === 2 && (index === 2 || index === 3)) || // 180°: bottom corners (stem points down)
        (piece.rotation === 3 && (index === 0 || index === 2))    // 270°: left corners (stem points left)
      );
      
      if (isFrontCorner) {
        frontCornersFilled++;
      }
    }
  });

  // T-Spin rules:
  // 1. Must have at least 3 corners filled
  // 2. Full T-Spin: Both front corners filled
  // 3. Mini T-Spin: Only 1 front corner filled (or special case with 1 front + 2 back)
  if (filledCorners >= 3) {
    if (frontCornersFilled === 2) {
      return 'full';
    } else if (frontCornersFilled >= 1) {
      return 'mini';
    }
  }
  return 'none';
}