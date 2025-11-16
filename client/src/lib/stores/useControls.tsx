import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface KeyBinding {
  moveLeft: string;
  moveRight: string;
  moveDown: string;
  rotate: string;
  rotateCounterclockwise: string;
  hardDrop: string;
  hold: string;
  pause: string;
}

interface ControlsState {
  keyBindings: KeyBinding;
  setKeyBindings: (bindings: KeyBinding) => void;
  resetToDefaults: () => void;
}

const DEFAULT_KEYS: KeyBinding = {
  moveLeft: "ArrowLeft",
  moveRight: "ArrowRight",
  moveDown: "ArrowDown",
  rotate: "ArrowUp",
  rotateCounterclockwise: "KeyZ",
  hardDrop: "Space",
  hold: "KeyC",
  pause: "Escape",
};

export const useControls = create<ControlsState>()(
  persist(
    (set) => ({
      keyBindings: DEFAULT_KEYS,
      
      setKeyBindings: (bindings: KeyBinding) => {
        set({ keyBindings: bindings });
      },
      
      resetToDefaults: () => {
        set({ keyBindings: DEFAULT_KEYS });
      },
    }),
    {
      name: "tetris-controls",
    }
  )
);