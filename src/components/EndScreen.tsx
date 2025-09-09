// Game completion and results screen

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from './GameEngine';
import { Trophy, Star, RotateCcw, Home, Target } from 'lucide-react';

interface EndScreenProps {
  levelCompleted: number;
  finalScore: number;
  accuracy: number;
  timeSpent: number;
}

const EndScreen: React.FC<EndScreenProps> = ({
  levelCompleted,
  finalScore,
  accuracy,
  timeSpent
}) => {
  const { endGame, selectLevel } = useGame();

  const getPerformanceRating = (accuracy: number) => {
    if (accuracy >= 90) return { rating: 'Excellent!', stars: 3, color: 'text-yellow-500' };
    if (accuracy >= 70) return { rating: 'Good Job!', stars: 2, color: 'text-blue-500' };
    return { rating: 'Keep Practicing!', stars: 1, color: 'text-green-500' };
  };

  const performance = getPerformanceRating(accuracy);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Results Card */}
        <Card className="game-card p-8 text-center mb-6 animate-bounce-in">
          <div className="w-20 h-20 bg-gradient-to-br from-game-primary to-game-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-2">Level Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Congratulations on completing Level {levelCompleted}
          </p>

          {/* Stars */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            {[1, 2, 3].map((star) => (
              <Star
                key={star}
                className={`w-8 h-8 ${
                  star <= performance.stars 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <div className={`text-2xl font-bold mb-8 ${performance.color}`}>
            {performance.rating}
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-game-primary mb-2">
                {finalScore}
              </div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-game-secondary mb-2">
                {Math.round(accuracy)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-game-accent mb-2">
                {formatTime(timeSpent)}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          {/* Achievements */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {accuracy >= 80 && (
              <Badge className="bg-gradient-to-r from-success to-success-light text-white">
                🎯 Sharp Shooter
              </Badge>
            )}
            {timeSpent < 300 && (
              <Badge className="bg-gradient-to-r from-game-accent to-warning text-white">
                ⚡ Speed Demon
              </Badge>
            )}
            {performance.stars === 3 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                ⭐ Perfect Score
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => selectLevel(levelCompleted)}
              className="game-button bg-gradient-to-r from-game-secondary to-game-primary text-white flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </Button>

            {levelCompleted < 5 && (
              <Button
                onClick={() => selectLevel(levelCompleted + 1)}
                className="game-button bg-gradient-to-r from-game-primary to-game-secondary text-white flex items-center space-x-2"
              >
                <Target className="w-4 h-4" />
                <span>Next Level</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => selectLevel(0)} // Go to level selection
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Menu</span>
            </Button>
          </div>
        </Card>

        {/* Next Level Preview */}
        {levelCompleted < 5 && (
          <Card className="game-card p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Up Next: Level {levelCompleted + 1}</h3>
            <p className="text-gray-600 mb-4">
              {levelCompleted === 1 && "Learn fraction addition and subtraction with visual models"}
              {levelCompleted === 2 && "Master equivalent fractions and simplification"}
              {levelCompleted === 3 && "Convert between mixed numbers and improper fractions"}
              {levelCompleted === 4 && "Solve real-world word problems with fractions"}
            </p>
            <Button
              onClick={() => selectLevel(levelCompleted + 1)}
              className="game-button bg-gradient-to-r from-success to-success-light text-white"
            >
              Continue Your Quest!
            </Button>
          </Card>
        )}

        {/* Game Complete Message */}
        {levelCompleted === 5 && (
          <Card className="game-card p-6 text-center bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <h3 className="text-2xl font-bold text-yellow-800 mb-2">
              🎉 Quest Complete! 🎉
            </h3>
            <p className="text-yellow-700 mb-4">
              You've mastered all levels of Fraction Quest! You're now a fraction expert!
            </p>
            <Button
              onClick={() => selectLevel(0)} // Go to level selection
              className="game-button bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            >
              Return to Start
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EndScreen;