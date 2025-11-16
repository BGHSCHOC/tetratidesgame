import { TetrominoType, getTetrominoShape } from "./tetrominos";
import { BOARD_WIDTH, BOARD_HEIGHT, POINTS } from "./constants";

export function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

export function isValidPosition(
  board: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number }
): boolean {
  const shape = getTetrominoShape(piece.type, piece.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        // Check bounds
        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
          return false;
        }
        
        // Check collision with existing pieces (allow pieces above the board)
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }
  
  return true;
}

export function placePiece(
  board: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number }
): (TetrominoType | null)[][] {
  const newBoard = board.map(row => [...row]);
  const shape = getTetrominoShape(piece.type, piece.rotation);
  
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        const boardX = piece.x + x;
        const boardY = piece.y + y;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.type;
        }
      }
    }
  }
  
  return newBoard;
}

export function clearLines(board: (TetrominoType | null)[][]): {
  newBoard: (TetrominoType | null)[][];
  linesCleared: number;
} {
  const newBoard = [...board];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== null)) {
      // Remove the complete line
      newBoard.splice(y, 1);
      // Add empty line at the top
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
      linesCleared++;
      y++; // Check the same row again
    }
  }
  
  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared: number, level: number): number {
  const basePoints = [0, POINTS.SINGLE, POINTS.DOUBLE, POINTS.TRIPLE, POINTS.TETRIS];
  return basePoints[linesCleared] * (level + 1);
}

export function getDropPosition(
  board: (TetrominoType | null)[][],
  piece: { type: TetrominoType; x: number; y: number; rotation: number }
): number {
  let dropY = piece.y;
  
  while (isValidPosition(board, { ...piece, y: dropY + 1 })) {
    dropY++;
  }
  
  return dropY;
}

export function isGameOver(board: (TetrominoType | null)[][]): boolean {
  // More accurate game over detection - check if pieces are locked above the spawn zone
  // In modern Tetris, game over occurs when pieces are placed above row 20 and can't move down
  return board[0].some(cell => cell !== null) && board[1].some(cell => cell !== null);
}
