// Hint system component

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGame } from './GameEngine';
import { HelpCircle, Eye, EyeOff, Lightbulb } from 'lucide-react';

export const HintPanel: React.FC = () => {
  const { state, useHint } = useGame();
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  
  const currentProblem = state.currentProblem;
  
  if (!currentProblem) return null;

  const revealHint = (index: number) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints([...revealedHints, index]);
      useHint(); // Track hint usage
    }
  };

  const isHintRevealed = (index: number) => revealedHints.includes(index);

  return (
    <Card className="game-card p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Lightbulb className="w-5 h-5 text-warning" />
        <span>Hints</span>
      </h3>
      
      <div className="space-y-3">
        {currentProblem.hints.map((hint, index) => (
          <div key={index} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">
                Hint {index + 1}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => revealHint(index)}
                disabled={isHintRevealed(index)}
                className="h-6 px-2"
              >
                {isHintRevealed(index) ? (
                  <EyeOff className="w-3 h-3" />
                ) : (
                  <Eye className="w-3 h-3" />
                )}
              </Button>
            </div>
            
            {isHintRevealed(index) ? (
              <p className="text-sm text-gray-700 animate-fade-in">
                {hint}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                Click to reveal hint {index + 1}
              </p>
            )}
          </div>
        ))}

        {/* Hint usage warning */}
        {revealedHints.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-warning" />
              <span className="text-sm text-yellow-800">
                Using hints reduces your score for this problem
              </span>
            </div>
          </div>
        )}

        {/* Level-specific hints */}
        {state.currentLevel === 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-medium text-blue-800 mb-2">Level 1 Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Drag items from the tray to friend plates</li>
              <li>• Make sure each friend gets an equal share</li>
              <li>• Leftover items become the fractional part</li>
            </ul>
          </div>
        )}

        {state.currentLevel === 2 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <h4 className="font-medium text-green-800 mb-2">Level 2 Tips:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Find a common denominator first</li>
              <li>• Use visual models to help understand</li>
              <li>• Simplify your final answer</li>
            </ul>
          </div>
        )}

        {state.currentLevel === 3 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-medium text-purple-800 mb-2">Level 3 Tips:</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Look for common factors</li>
              <li>• Equivalent fractions have the same value</li>
              <li>• Divide both parts by the same number</li>
            </ul>
          </div>
        )}

        {state.currentLevel === 4 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <h4 className="font-medium text-orange-800 mb-2">Level 4 Tips:</h4>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Count how many whole groups you can make</li>
              <li>• The remainder becomes the fractional part</li>
              <li>• Remember: whole × denominator + numerator</li>
            </ul>
          </div>
        )}

        {state.currentLevel === 5 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h4 className="font-medium text-red-800 mb-2">Level 5 Tips:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Read the problem carefully</li>
              <li>• Identify what operation is needed</li>
              <li>• Work step by step for complex problems</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};