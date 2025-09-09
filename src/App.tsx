import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider, useGame } from "./components/GameEngine";
import StartScreen from "./components/StartScreen";
import LevelSelect from "./components/LevelSelect";
import GameBoard from "./components/GameBoard";

const queryClient = new QueryClient();

// Main game component that handles different screens
const GameApp: React.FC = () => {
  const { state } = useGame();
  
  if (!state.isPlaying) {
    return <StartScreen />;
  }
  
  if (state.currentLevel === 0) {
    return <LevelSelect />;
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
