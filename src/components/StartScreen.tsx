// Beautiful start screen with game branding

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from './GameEngine';
import { Calculator, Star, Target, Zap } from 'lucide-react';

const StartScreen: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="mb-12 animate-bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-game-primary to-game-secondary rounded-full mb-6 animate-float">
            <Calculator className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-game-primary via-game-secondary to-game-accent bg-clip-text text-transparent">
            Fraction Quest
          </h1>
          
          <p className="text-2xl text-gray-600 mb-2">
            Grades 6–12 Edition
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Master fractions through interactive gameplay! Share items, solve problems, 
            and unlock new levels in this comprehensive fraction learning adventure.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="game-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-success to-success-light rounded-full flex items-center justify-center mb-4 mx-auto">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">5 Progressive Levels</h3>
            <p className="text-gray-600">
              From basic sharing to complex word problems, each level builds on the last
            </p>
          </Card>

          <Card className="game-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-game-accent to-warning rounded-full flex items-center justify-center mb-4 mx-auto">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
            <p className="text-gray-600">
              Drag and drop pieces, visualize fractions, and learn through hands-on practice
            </p>
          </Card>

          <Card className="game-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-game-secondary to-game-primary rounded-full flex items-center justify-center mb-4 mx-auto">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-World Problems</h3>
            <p className="text-gray-600">
              Apply fraction skills to cooking, sharing, and everyday scenarios
            </p>
          </Card>
        </div>

        {/* Game Topics Preview */}
        <div className="game-card p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">What You'll Master</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-game-primary rounded-full"></div>
              <span>Sharing items equally & mixed numbers</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-game-secondary rounded-full"></div>
              <span>Adding & subtracting fractions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-game-accent rounded-full"></div>
              <span>Equivalent fractions & simplification</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Converting between fraction forms</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Real-world word problems</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span>Multi-step reasoning skills</span>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <Button 
          onClick={startGame}
          size="lg"
          className="game-button bg-gradient-to-r from-game-primary to-game-secondary text-white px-12 py-4 text-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Start Your Quest
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          Ready to become a fraction master? Let's begin!
        </p>
      </div>
    </div>
  );
};

export default StartScreen;