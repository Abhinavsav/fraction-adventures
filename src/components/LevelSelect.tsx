// Level selection screen with progress tracking

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from './GameEngine';
import { LEVEL_CONFIGS } from '../utils/problemGenerator';
import { ArrowLeft, Lock, Star, Clock, Target } from 'lucide-react';

const LevelSelect: React.FC = () => {
  const { state, selectLevel, endGame } = useGame();

  const getLevelStatus = (levelId: number) => {
    const progress = state.levelProgress.find(p => p.levelId === levelId);
    if (!progress) return 'locked';
    if (progress.completed) return 'completed';
    if (progress.unlocked) return 'available';
    return 'locked';
  };

  const getLevelStars = (levelId: number) => {
    const progress = state.levelProgress.find(p => p.levelId === levelId);
    if (!progress || !progress.completed) return 0;
    
    const accuracy = progress.correctAnswers / progress.attempts;
    if (accuracy >= 0.9) return 3;
    if (accuracy >= 0.7) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={endGame}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Start</span>
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-game-primary to-game-secondary bg-clip-text text-transparent">
              Choose Your Level
            </h1>
            <p className="text-gray-600 mt-2">Select a level to start your fraction quest</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Score</p>
            <p className="text-2xl font-bold text-game-primary">{state.score}</p>
          </div>
        </div>

        {/* Level Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {LEVEL_CONFIGS.map((level) => {
            const status = getLevelStatus(level.id);
            const stars = getLevelStars(level.id);
            const progress = state.levelProgress.find(p => p.levelId === level.id);
            
            return (
              <Card
                key={level.id}
                className={`level-card relative overflow-hidden ${
                  status === 'completed' ? 'completed' : ''
                } ${status === 'locked' ? 'locked' : ''}`}
                onClick={() => (status === 'available' || status === 'completed') && selectLevel(level.id)}
              >
                {/* Level Number Badge */}
                <div className="absolute top-4 right-4">
                  <Badge 
                    variant={status === 'completed' ? 'default' : 'secondary'}
                    className={`text-lg px-3 py-1 ${
                      status === 'completed' 
                        ? 'bg-gradient-to-r from-success to-success-light text-white' 
                        : ''
                    }`}
                  >
                    {level.id}
                  </Badge>
                </div>

                {/* Lock Icon for Locked Levels */}
                {status === 'locked' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
                    <Lock className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  {/* Title and Description */}
                  <h3 className="text-xl font-bold mb-2 pr-12">{level.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{level.description}</p>
                  
                  {/* Objective */}
                  <div className="flex items-start space-x-2 mb-4">
                    <Target className="w-4 h-4 text-game-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{level.objective}</p>
                  </div>

                  {/* Level Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{level.timeLimit}s</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{level.problemCount} problems</span>
                    </div>
                  </div>

                  {/* Progress and Stars */}
                  {status !== 'locked' && (
                    <div className="space-y-3">
                      {/* Stars for completed levels */}
                      {status === 'completed' && (
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= stars 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Progress stats */}
                      {progress && progress.attempts > 0 && (
                        <div className="text-xs text-gray-500">
                          <div className="flex justify-between">
                            <span>Best Score: {progress.score}</span>
                            <span>
                              Accuracy: {Math.round((progress.correctAnswers / progress.attempts) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        className={`w-full mt-4 ${
                          status === 'completed' 
                            ? 'bg-gradient-to-r from-success to-success-light text-white'
                            : 'bg-gradient-to-r from-game-primary to-game-secondary text-white'
                        } game-button`}
                      >
                        {status === 'completed' ? 'Play Again' : 'Start Level'}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary */}
        <div className="mt-12 game-card p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-3xl font-bold text-game-primary">
                {state.levelProgress.filter(p => p.completed).length}
              </p>
              <p className="text-sm text-gray-600">Levels Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-game-secondary">
                {state.levelProgress.reduce((sum, p) => sum + p.correctAnswers, 0)}
              </p>
              <p className="text-sm text-gray-600">Correct Answers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-game-accent">
                {state.score}
              </p>
              <p className="text-sm text-gray-600">Total Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-success">
                {state.levelProgress.reduce((sum, p) => sum + p.score, 0)}
              </p>
              <p className="text-sm text-gray-600">Best Scores</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect;