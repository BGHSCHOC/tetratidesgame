import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import TetrisGame from "./components/tetris/TetrisGame";
import { HomeScreen, GameMode } from "./components/HomeScreen";
import "./index.css";

const queryClient = new QueryClient();

interface GameModeConfig {
  mode: GameMode;
  timeLimit?: number;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'game'>('home');
  const [gameConfig, setGameConfig] = useState<GameModeConfig | null>(null);

  const handleStartGame = (config: GameModeConfig) => {
    setGameConfig(config);
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setGameConfig(null);
    // Reset any persisted game state when returning to home
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen">
        {currentScreen === 'home' ? (
          <HomeScreen onStartGame={handleStartGame} />
        ) : (
          <TetrisGame 
            gameConfig={gameConfig} 
            onBackToHome={handleBackToHome}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
