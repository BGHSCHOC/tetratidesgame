import React, { useState, useEffect } from "react";

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

interface ControlSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  keyBindings: KeyBinding;
  onSave: (bindings: KeyBinding) => void;
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

const KEY_NAMES: Record<string, string> = {
  ArrowLeft: "←",
  ArrowRight: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  Space: "Space",
  KeyA: "A",
  KeyS: "S",
  KeyD: "D",
  KeyW: "W",
  KeyC: "C",
  KeyZ: "Z",
  KeyX: "X",
  Escape: "Esc",
  Enter: "Enter",
};

const ControlSettings: React.FC<ControlSettingsProps> = ({
  isOpen,
  onClose,
  keyBindings,
  onSave,
}) => {
  const [bindings, setBindings] = useState<KeyBinding>(keyBindings);
  const [recording, setRecording] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBindings(keyBindings);
    }
  }, [isOpen, keyBindings]);

  const startRecording = (action: keyof KeyBinding) => {
    setRecording(action);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!recording) return;
    
    event.preventDefault();
    const key = event.code;
    
    setBindings(prev => ({
      ...prev,
      [recording]: key,
    }));
    setRecording(null);
  };

  const resetToDefaults = () => {
    setBindings(DEFAULT_KEYS);
  };

  const handleSave = () => {
    onSave(bindings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <h2 className="text-xl font-bold mb-4">Control Settings</h2>
        
        <div className="space-y-3 mb-6">
          {Object.entries(bindings).map(([action, key]) => (
            <div key={action} className="flex justify-between items-center">
              <span className="capitalize">
                {action.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <button
                onClick={() => startRecording(action as keyof KeyBinding)}
                className={`px-3 py-1 rounded border ${
                  recording === action
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-gray-600 bg-gray-700 hover:bg-gray-600'
                }`}
                disabled={recording !== null && recording !== action}
              >
                {recording === action
                  ? 'Press key...'
                  : KEY_NAMES[key] || key
                }
              </button>
            </div>
          ))}
        </div>
        
        {recording && (
          <div className="mb-4 p-3 bg-blue-900 rounded text-center">
            Press any key to set the control for {recording.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        )}
        
        <div className="flex gap-2">
          <button
            onClick={resetToDefaults}
            className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 px-4 rounded"
            disabled={recording !== null}
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
            disabled={recording !== null}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-600 hover:bg-green-700 py-2 px-4 rounded"
            disabled={recording !== null}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlSettings;