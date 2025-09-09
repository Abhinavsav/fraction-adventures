// Score and progress tracking component

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from './GameEngine';
import { Trophy, Target, Clock, Zap } from 'lucide-react';

export const ScoreBoard: React.FC = () => {
  const { state } = useGame();
  
  const currentProgress = state.levelProgress.find(p => p.levelId === state.currentLevel);
  const accuracy = currentProgress ? 
    (currentProgress.correctAnswers / Math.max(currentProgress.attempts, 1)) * 100 : 0;

  return (
    <Card className="game-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Trophy className="w-5 h-5 text-game-primary" />
        <span>Score Board</span>
      </h3>
      
      <div className="space-y-4">
        {/* Current Score */}
        <div className="text-center">
          <div className="text-3xl font-bold text-game-primary">
            {state.score}
          </div>
          <div className="text-sm text-gray-600">Current Score</div>
        </div>

        {/* Level Progress */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-game-secondary mr-1" />
            </div>
            <div className="text-xl font-bold text-game-secondary">
              {currentProgress?.correctAnswers || 0}/5
            </div>
            <div className="text-xs text-gray-600">Correct</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-game-accent mr-1" />
            </div>
            <div className="text-xl font-bold text-game-accent">
              {Math.round(accuracy)}%
            </div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-600">Time Remaining</span>
          </div>
          <div className={`text-2xl font-bold ${
            state.timeRemaining < 30 ? 'text-red-500' : 'text-gray-800'
          }`}>
            {Math.floor(state.timeRemaining / 60)}:{(state.timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>

        {/* Streak indicator (if applicable) */}
        {currentProgress && currentProgress.correctAnswers > 0 && (
          <div className="text-center">
            <Badge variant="secondary" className="bg-gradient-to-r from-success to-success-light text-white">
              {currentProgress.correctAnswers} correct in a row! 🔥
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};