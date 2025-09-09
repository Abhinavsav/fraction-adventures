// Main game board component that handles different level types

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useGame } from './GameEngine';
import { FractionVisualizer, DroppableZone } from './FractionVisualizer';
import { ScoreBoard } from './ScoreBoard';
import { HintPanel } from './HintPanel';
import { Clock, ArrowLeft, CheckCircle, HelpCircle } from 'lucide-react';
import { Fraction, MixedNumber } from '../types/game';
import { FractionMath } from '../utils/fractionMath';

const GameBoard: React.FC = () => {
  const { state, submitAnswer, useHint, nextProblem, endGame } = useGame();
  const [playerAnswer, setPlayerAnswer] = useState<string>('');
  const [showHints, setShowHints] = useState(false);
  const [numerator, setNumerator] = useState<string>('');
  const [denominator, setDenominator] = useState<string>('');
  const [wholePart, setWholePart] = useState<string>('');

  // Reset inputs when problem changes
  React.useEffect(() => {
    setPlayerAnswer('');
    setNumerator('');
    setDenominator('');
    setWholePart('');
    setShowHints(false);
  }, [state.currentProblem?.id]);

  const currentProblem = state.currentProblem;
  const currentProgress = state.levelProgress.find(p => p.levelId === state.currentLevel);

  if (!currentProblem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="game-card p-8 text-center">
          <p className="text-xl">Loading problem...</p>
        </Card>
      </div>
    );
  }

  const handleSubmitAnswer = () => {
    let answer: any = null;

    // Parse answer based on input type
    if (playerAnswer) {
      answer = playerAnswer;
    } else if (numerator && denominator) {
      if (wholePart) {
        // Mixed number
        answer = {
          whole: parseInt(wholePart) || 0,
          fraction: {
            numerator: parseInt(numerator) || 0,
            denominator: parseInt(denominator) || 1
          }
        };
      } else {
        // Simple fraction
        answer = {
          numerator: parseInt(numerator) || 0,
          denominator: parseInt(denominator) || 1
        };
      }
    }

    if (answer) {
      submitAnswer(answer);
      // Generate next problem after a short delay
      setTimeout(() => {
        nextProblem();
        // Reset inputs
        setPlayerAnswer('');
        setNumerator('');
        setDenominator('');
        setWholePart('');
      }, 1500);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderLevel1Interface = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Visual representation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Items to Share</h3>
          <FractionVisualizer
            fraction={{ numerator: currentProblem.params.N, denominator: currentProblem.params.N }}
            type={currentProblem.assets as any}
            interactive={true}
          />
        </div>

        {/* Friends/Plates */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Friends ({currentProblem.params.F})</h3>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: currentProblem.params.F }, (_, i) => (
              <DroppableZone
                key={`friend_${i}`}
                zone={{
                  id: `friend_${i}`,
                  type: 'friend',
                  position: { x: 0, y: 0 },
                  items: [],
                  accepts: ['laddu', 'cake-slice']
                }}
                onDrop={() => {}}
                className="min-h-24 p-4"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Answer input */}
      <div className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">Each friend gets:</h3>
        <div className="flex items-center space-x-4">
          <Input
            type="number"
            placeholder="Whole"
            value={wholePart}
            onChange={(e) => setWholePart(e.target.value)}
            className="w-20"
          />
          <span className="text-xl">+</span>
          <Input
            type="number"
            placeholder="Num"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            className="w-20"
          />
          <span className="text-xl">/</span>
          <Input
            type="number"
            placeholder="Den"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            className="w-20"
          />
        </div>
      </div>
    </div>
  );

  const renderLevel2Interface = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FractionVisualizer
          fraction={currentProblem.params.frac1}
          type="cake"
          className="opacity-80"
        />
        <FractionVisualizer
          fraction={currentProblem.params.frac2}
          type="cake"
          className="opacity-80"
        />
      </div>

      <div className="text-center">
        <span className="text-3xl font-bold">
          {currentProblem.params.operation === 'add' ? '+' : '-'}
        </span>
      </div>

      <div className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">Result:</h3>
        <div className="flex items-center justify-center space-x-4">
          <Input
            type="number"
            placeholder="Numerator"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            className="w-24"
          />
          <span className="text-xl">/</span>
          <Input
            type="number"
            placeholder="Denominator"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );

  const renderLevel3Interface = () => (
    <div className="space-y-6">
      <FractionVisualizer
        fraction={currentProblem.params.fraction || currentProblem.params.baseFraction}
        type="pizza"
      />

      <div className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          {currentProblem.params.fraction ? 'Simplified form:' : 'Equivalent fraction:'}
        </h3>
        <div className="flex items-center justify-center space-x-4">
          <Input
            type="number"
            placeholder="Numerator"
            value={numerator}
            onChange={(e) => setNumerator(e.target.value)}
            className="w-24"
          />
          <span className="text-xl">/</span>
          <Input
            type="number"
            placeholder="Denominator"
            value={denominator}
            onChange={(e) => setDenominator(e.target.value)}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );

  const renderLevel4Interface = () => (
    <div className="space-y-6">
      <FractionVisualizer
        fraction={
          currentProblem.params.fraction || 
          FractionMath.toImproperFraction(currentProblem.params.mixedNumber)
        }
        type="laddus"
      />

      <div className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">
          Convert to {currentProblem.params.conversionType === 'improper_to_mixed' ? 'mixed number' : 'improper fraction'}:
        </h3>
        
        {currentProblem.params.conversionType === 'improper_to_mixed' ? (
          <div className="flex items-center justify-center space-x-4">
            <Input
              type="number"
              placeholder="Whole"
              value={wholePart}
              onChange={(e) => setWholePart(e.target.value)}
              className="w-20"
            />
            <Input
              type="number"
              placeholder="Num"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              className="w-20"
            />
            <span className="text-xl">/</span>
            <Input
              type="number"
              placeholder="Den"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              className="w-20"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <Input
              type="number"
              placeholder="Numerator"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
              className="w-24"
            />
            <span className="text-xl">/</span>
            <Input
              type="number"
              placeholder="Denominator"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
              className="w-24"
            />
          </div>
        )}
      </div>
    </div>
  );

  const renderLevel5Interface = () => (
    <div className="space-y-6">
      <div className="game-card p-6">
        <div className="text-lg leading-relaxed">
          {currentProblem.question}
        </div>
      </div>

      <div className="game-card p-6">
        <h3 className="text-lg font-semibold mb-4">Your Answer:</h3>
        <div className="flex items-center justify-center space-x-4">
          {currentProblem.params.problemType === 'multi_step' ? (
            <Input
              type="text"
              placeholder="Answer (e.g., 3/4 or 1 1/2)"
              value={playerAnswer}
              onChange={(e) => setPlayerAnswer(e.target.value)}
              className="w-48"
            />
          ) : (
            <>
              <Input
                type="number"
                placeholder="Numerator"
                value={numerator}
                onChange={(e) => setNumerator(e.target.value)}
                className="w-24"
              />
              <span className="text-xl">/</span>
              <Input
                type="number"
                placeholder="Denominator"
                value={denominator}
                onChange={(e) => setDenominator(e.target.value)}
                className="w-24"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={endGame} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Levels</span>
          </Button>

          <div className="text-center">
            <h1 className="text-2xl font-bold">Level {state.currentLevel}</h1>
            <p className="text-gray-600">Problem {(currentProgress?.attempts || 0) + 1} of 5</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4" />
              <span className={state.timeRemaining < 30 ? 'text-red-500 font-bold' : ''}>
                {formatTime(state.timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <Progress 
            value={(currentProgress?.correctAnswers || 0) * 20} 
            className="h-2"
          />
          <p className="text-sm text-gray-600 mt-1 text-center">
            {currentProgress?.correctAnswers || 0} / 5 correct answers needed
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main game area */}
          <div className="lg:col-span-3">
            <div className="game-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{currentProblem.question}</h2>
              
              {/* Level-specific interface */}
              {state.currentLevel === 1 && renderLevel1Interface()}
              {state.currentLevel === 2 && renderLevel2Interface()}
              {state.currentLevel === 3 && renderLevel3Interface()}
              {state.currentLevel === 4 && renderLevel4Interface()}
              {state.currentLevel === 5 && renderLevel5Interface()}

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center space-x-2"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Hints</span>
                </Button>

                <div className="space-x-4">
                  <Button variant="outline" onClick={nextProblem}>
                    Skip
                  </Button>
                  <Button 
                    onClick={handleSubmitAnswer}
                    className="game-button bg-gradient-to-r from-game-primary to-game-secondary text-white"
                    disabled={(!numerator && !playerAnswer) || (!!numerator && !denominator)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submit Answer
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScoreBoard />
            {showHints && <HintPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;