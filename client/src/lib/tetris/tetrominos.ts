export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

export interface TetrominoShape {
  type: TetrominoType;
  shape: boolean[][];
  color: string;
}

export const TETROMINOS: Record<TetrominoType, TetrominoShape> = {
  I: {
    type: "I",
    shape: [
      [false, false, false, false],
      [true, true, true, true],
      [false, false, false, false],
      [false, false, false, false],
    ],
    color: "#00f0f0",
  },
  O: {
    type: "O",
    shape: [
      [true, true],
      [true, true],
    ],
    color: "#f0f000",
  },
  T: {
    type: "T",
    shape: [
      [false, true, false],
      [true, true, true],
      [false, false, false],
    ],
    color: "#ff1493", // Hot pink - very distinctive
  },
  S: {
    type: "S",
    shape: [
      [false, true, true],
      [true, true, false],
      [false, false, false],
    ],
    color: "#00f000",
  },
  Z: {
    type: "Z",
    shape: [
      [true, true, false],
      [false, true, true],
      [false, false, false],
    ],
    color: "#8b0000", // Dark red - distinctive from pink T piece
  },
  J: {
    type: "J",
    shape: [
      [true, false, false],
      [true, true, true],
      [false, false, false],
    ],
    color: "#0000f0",
  },
  L: {
    type: "L",
    shape: [
      [false, false, true],
      [true, true, true],
      [false, false, false],
    ],
    color: "#f0a000",
  },
};

export const TETROMINO_TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"];

// Enhanced 7-bag randomization system with rare inconsistencies
class TetrominoBag {
  private bag: TetrominoType[] = [];
  
  getNext(): TetrominoType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }
  
  reset(): void {
    this.bag = [];
  }
  
  private refillBag() {
    // 7-bag system with extremely rare exceptions for legendary gameplay moments
    // 99% of the time: standard 7-bag (one of each piece)
    // 1% of the time: allow duplicates for mythical patterns (excluding S, Z, O)
    
    if (Math.random() < 0.99) {
      // Standard 7-bag: exactly one of each piece type
      this.bag = [...TETROMINO_TYPES];
    } else {
      // Mythical exception: add duplicate of non-annoying pieces only
      this.bag = [...TETROMINO_TYPES];
      
      // Only duplicate I, T, J, L pieces (exclude S, Z, O as they're annoying)
      const goodPieces: TetrominoType[] = ["I", "T", "J", "L"];
      const numDuplicates = Math.random() < 0.8 ? 1 : 2;
      
      for (let i = 0; i < numDuplicates; i++) {
        const randomGoodPiece = goodPieces[Math.floor(Math.random() * goodPieces.length)];
        this.bag.push(randomGoodPiece);
      }
    }
    
    // Fisher-Yates shuffle for random distribution
    for (let i = this.bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
}

const tetrominoBag = new TetrominoBag();

export function getRandomTetromino(): TetrominoType {
  return tetrominoBag.getNext();
}

export function resetTetrominoBag(): void {
  tetrominoBag.reset();
}

export function rotateTetromino(shape: boolean[][]): boolean[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = Array(cols).fill(null).map(() => Array(rows).fill(false));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      rotated[j][rows - 1 - i] = shape[i][j];
    }
  }
  
  return rotated;
}

export function getTetrominoShape(type: TetrominoType, rotation: number): boolean[][] {
  let shape = TETROMINOS[type].shape;
  
  for (let i = 0; i < rotation; i++) {
    shape = rotateTetromino(shape);
  }
  
  return shape;
}
