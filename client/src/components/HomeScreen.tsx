import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, Trophy, Settings } from 'lucide-react';
import { OceanBackdrop } from './ui/OceanBackdrop';
import { GitHubPush } from './GitHubPush';

export type GameMode = 'classic' | 'sprint';

interface GameModeConfig {
  mode: GameMode;
  timeLimit?: number; // For sprint mode in seconds
}

interface HomeScreenProps {
  onStartGame: (config: GameModeConfig) => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('classic');
  const [sprintTime, setSprintTime] = useState(120); // Default 2 minutes

  const gameModes = [
    {
      id: 'classic' as GameMode,
      title: 'Deep Sea Dive',
      description: 'Descend through ocean depths with increasing pressure and endless exploration',
      icon: Trophy,
      features: [
        'Increasing depth levels',
        'Perfect clear treasure celebrations',
        'Coral spin detection and scoring',
        'Combo system with bioluminescent effects',
        'Sea creature hold functionality'
      ]
    },
    {
      id: 'sprint' as GameMode,
      title: 'Tidal Rush',
      description: 'Build coral formations before the tide changes',
      icon: Clock,
      features: [
        'Timed underwater challenge',
        'Adjustable tide timers',
        'Score based on coral lines cleared',
        'Fast-paced oceanic action',
        'Personal depth records'
      ]
    }
  ];

  const sprintTimeOptions = [
    { value: 60, label: '1 Minute' },
    { value: 120, label: '2 Minutes' },
    { value: 180, label: '3 Minutes' },
    { value: 300, label: '5 Minutes' }
  ];

  const handleStartGame = () => {
    const config: GameModeConfig = {
      mode: selectedMode,
      ...(selectedMode === 'sprint' && { timeLimit: sprintTime })
    };
    onStartGame(config);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <OceanBackdrop />
      
      {/* GitHub Push Button - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-20">
        <GitHubPush />
      </div>
      
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-7xl font-black mb-4"
              style={{ 
                color: '#40E0D0',
                textShadow: '0 0 20px rgba(64, 224, 208, 0.8), 0 0 40px rgba(64, 224, 208, 0.4)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))'
              }}>
            🌊 TETRATIDES 🌊
          </h1>
          <p className="text-xl text-cyan-200 mb-8"
             style={{ textShadow: '0 0 8px rgba(64, 224, 208, 0.4)' }}>
            Dive into the depths and build coral formations
          </p>
        </div>

        {/* Game Modes */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {gameModes.map((mode) => {
            const IconComponent = mode.icon;
            const isSelected = selectedMode === mode.id;
            
            return (
              <Card 
                key={mode.id}
                className="cursor-pointer transition-all duration-300 transform hover:scale-105"
                style={{
                  background: isSelected 
                    ? 'linear-gradient(145deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))'
                    : 'linear-gradient(145deg, rgba(30, 60, 114, 0.3), rgba(12, 24, 41, 0.5))',
                  border: isSelected 
                    ? '2px solid rgba(64, 224, 208, 0.8)'
                    : '2px solid rgba(64, 224, 208, 0.3)',
                  boxShadow: isSelected 
                    ? '0 0 30px rgba(64, 224, 208, 0.4)'
                    : '0 0 15px rgba(64, 224, 208, 0.2)',
                  backdropFilter: 'blur(5px)',
                }}
                onClick={() => setSelectedMode(mode.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full"
                         style={{
                           background: isSelected 
                             ? 'linear-gradient(135deg, rgba(64, 224, 208, 0.8), rgba(255, 127, 80, 0.6))'
                             : 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                           boxShadow: isSelected 
                             ? '0 0 20px rgba(64, 224, 208, 0.4)'
                             : '0 0 10px rgba(64, 224, 208, 0.2)',
                         }}>
                      <IconComponent className="h-8 w-8 text-cyan-100" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl text-cyan-100"
                             style={{ textShadow: '0 0 8px rgba(64, 224, 208, 0.6)' }}>
                    {mode.title}
                  </CardTitle>
                  <CardDescription className="text-cyan-200 text-base"
                                   style={{ textShadow: '0 0 5px rgba(64, 224, 208, 0.4)' }}>
                    {mode.description}
                  </CardDescription>
                </CardHeader>

              </Card>
            );
          })}
        </div>

        {/* Tidal Rush Settings */}
        {selectedMode === 'sprint' && (
          <Card className="mb-8"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.4), rgba(12, 24, 41, 0.6))',
                  border: '2px solid rgba(64, 224, 208, 0.3)',
                  boxShadow: '0 0 20px rgba(64, 224, 208, 0.2)',
                  backdropFilter: 'blur(5px)',
                }}>
            <CardHeader>
              <CardTitle className="text-cyan-200 flex items-center gap-2"
                         style={{ textShadow: '0 0 8px rgba(64, 224, 208, 0.6)' }}>
                <Settings className="h-5 w-5" />
                🌊 Tidal Rush Settings 🌊
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-300 mb-2 text-sm font-medium"
                         style={{ textShadow: '0 0 5px rgba(64, 224, 208, 0.4)' }}>
                    Tide Timer Duration
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sprintTimeOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={sprintTime === option.value ? "default" : "outline"}
                        className="transition-all duration-200"
                        style={{
                          background: sprintTime === option.value 
                            ? 'linear-gradient(135deg, rgba(64, 224, 208, 0.8), rgba(255, 127, 80, 0.6))'
                            : 'transparent',
                          border: sprintTime === option.value 
                            ? '2px solid rgba(64, 224, 208, 0.8)'
                            : '2px solid rgba(64, 224, 208, 0.3)',
                          color: '#a5f3fc',
                          boxShadow: sprintTime === option.value 
                            ? '0 0 15px rgba(64, 224, 208, 0.4)'
                            : '0 0 5px rgba(64, 224, 208, 0.2)',
                        }}
                        onClick={() => setSprintTime(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dive Button */}
        <div className="text-center">
          <Button
            onClick={handleStartGame}
            className="px-12 py-4 text-xl font-bold rounded-xl transform transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, rgba(64, 224, 208, 0.9), rgba(255, 127, 80, 0.7), rgba(65, 105, 225, 0.8))',
              border: '2px solid rgba(64, 224, 208, 0.8)',
              color: '#ffffff',
              textShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              boxShadow: '0 0 30px rgba(64, 224, 208, 0.5), 0 4px 15px rgba(0, 0, 0, 0.3)',
            }}
          >
            🌊 Dive Into {selectedMode === 'classic' ? 'Deep Sea' : `${sprintTime / 60}min Tidal Rush`} 🌊
          </Button>
          
          <div className="mt-6 p-4 rounded-lg max-w-md mx-auto"
               style={{
                 background: 'linear-gradient(145deg, rgba(30, 60, 114, 0.3), rgba(12, 24, 41, 0.5))',
                 border: '1px solid rgba(64, 224, 208, 0.3)',
                 boxShadow: '0 0 15px rgba(64, 224, 208, 0.2)',
                 backdropFilter: 'blur(3px)',
               }}>
            <h4 className="text-cyan-200 text-sm font-semibold mb-2 text-center"
                style={{ textShadow: '0 0 5px rgba(64, 224, 208, 0.6)' }}>
              🎮 Navigation Controls 🎮
            </h4>
            <div className="space-y-3">
              {/* Movement Keys */}
              <div>
                <div className="text-cyan-300 text-xs mb-2 text-center">Navigate</div>
                <div className="flex justify-center gap-1">
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">←</span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">↓</span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">→</span>
                  </div>
                </div>
              </div>

              {/* Rotation Keys */}
              <div>
                <div className="text-cyan-300 text-xs mb-2 text-center">Coral Spin</div>
                <div className="flex justify-center gap-1">
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">↑</span>
                  </div>
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">Z</span>
                  </div>
                </div>
              </div>

              {/* Other Keys */}
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="text-cyan-300 text-xs mb-1">Hold Creature</div>
                  <div 
                    className="w-8 h-8 rounded flex items-center justify-center mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">C</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-cyan-300 text-xs mb-1">Deep Drop</div>
                  <div 
                    className="w-12 h-8 rounded flex items-center justify-center mx-auto"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.6), rgba(12, 24, 41, 0.8))',
                      border: '1px solid rgba(64, 224, 208, 0.5)',
                      boxShadow: '0 0 6px rgba(64, 224, 208, 0.3)',
                    }}
                  >
                    <span className="font-mono text-cyan-200 font-bold text-xs">Space</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}