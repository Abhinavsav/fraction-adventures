import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider, useGame } from "./components/GameEngine";
import StartScreen from "./components/StartScreen";
import LevelSelect from "./components/LevelSelect";
import GameBoard from "./components/GameBoard";
import EndScreen from "./components/EndScreen";

const queryClient = new QueryClient();

// Main game component that handles different screens
const GameApp: React.FC = () => {
  const { state } = useGame();
  
  // Check if current level is completed
  const currentProgress = state.levelProgress.find(p => p.levelId === state.currentLevel);
  const isLevelComplete = currentProgress?.completed && state.currentLevel > 0;
  
  if (!state.isPlaying) {
    return <StartScreen />;
  }
  
  if (state.currentLevel === 0) {
    return <LevelSelect />;
  }
  
  if (isLevelComplete) {
    return <EndScreen 
      levelCompleted={state.currentLevel}
      finalScore={state.score}
      accuracy={currentProgress ? (currentProgress.correctAnswers / Math.max(currentProgress.attempts, 1)) * 100 : 0}
      timeSpent={currentProgress ? currentProgress.timeSpent : 0}
    />;
  }
  
  return <GameBoard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GameProvider>
        <GameApp />
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
