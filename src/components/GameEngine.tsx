// Main game engine and state management

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState, LevelProgress, Problem, GameSettings, AnalyticsEvent } from '../types/game';
import { LEVEL_CONFIGS } from '../utils/problemGenerator';
import { useToast } from '@/hooks/use-toast';
import { soundEngine } from '../utils/soundEngine';
import { FractionMath } from '../utils/fractionMath';

interface GameContextType {
  state: GameState;
  startGame: () => void;
  selectLevel: (levelId: number) => void;
  submitAnswer: (answer: any) => void;
  useHint: () => void;
  nextProblem: () => void;
  endGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  emitAnalytics: (event: AnalyticsEvent) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_LEVEL'; levelId: number }
  | { type: 'LOAD_PROBLEM'; problem: Problem }
  | { type: 'SUBMIT_ANSWER'; answer: any; isCorrect: boolean; scoreDelta: number }
  | { type: 'USE_HINT' }
  | { type: 'NEXT_PROBLEM' }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'TICK_TIMER' }
  | { type: 'LEVEL_COMPLETE'; levelId: number }
  | { type: 'RESET_LEVEL'; levelId: number };

const initialState: GameState = {
  currentLevel: 0,
  score: 0,
  timeRemaining: 0,
  isPlaying: false,
  currentProblem: null,
  levelProgress: LEVEL_CONFIGS.map((config, index) => ({
    levelId: config.id,
    completed: false,
    score: 0,
    attempts: 0,
    correctAnswers: 0,
    timeSpent: 0,
    unlocked: index === 0 // Only first level unlocked initially
  })),
  gameSettings: {
    soundEnabled: true,
    musicEnabled: true,
    difficulty: 'medium',
    hintsEnabled: true
  }
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        isPlaying: true,
        score: 0
      };

    case 'SELECT_LEVEL':
      const levelConfig = LEVEL_CONFIGS.find(l => l.id === action.levelId);
      
      // Level 0 means level selection screen
      if (action.levelId === 0) {
        return {
          ...state,
          currentLevel: 0,
          isPlaying: true
        };
      }
      
      if (!levelConfig) return state;

      const isUnlocked = state.levelProgress.find(p => p.levelId === action.levelId)?.unlocked;
      if (!isUnlocked) return state;

      return {
        ...state,
        currentLevel: action.levelId,
        timeRemaining: levelConfig.timeLimit,
        isPlaying: true
      };

    case 'LOAD_PROBLEM':
      return {
        ...state,
        currentProblem: action.problem
      };

    case 'SUBMIT_ANSWER':
      const updatedProgress = state.levelProgress.map(progress => {
        if (progress.levelId === state.currentLevel) {
          return {
            ...progress,
            attempts: progress.attempts + 1,
            correctAnswers: action.isCorrect ? progress.correctAnswers + 1 : progress.correctAnswers,
            score: progress.score + action.scoreDelta
          };
        }
        return progress;
      });

      return {
        ...state,
        score: state.score + action.scoreDelta,
        levelProgress: updatedProgress
      };

    case 'LEVEL_COMPLETE':
      const completedProgress = state.levelProgress.map((progress, index) => {
        if (progress.levelId === action.levelId) {
          return {
            ...progress,
            completed: true,
            timeSpent: state.timeRemaining > 0 ? LEVEL_CONFIGS.find(l => l.id === action.levelId)?.timeLimit! - state.timeRemaining : 0
          };
        }
        // Unlock next level
        if (progress.levelId === action.levelId + 1) {
          return {
            ...progress,
            unlocked: true
          };
        }
        return progress;
      });

      return {
        ...state,
        levelProgress: completedProgress
      };

    case 'TICK_TIMER':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.settings }
      };

    case 'RESET_LEVEL':
      return {
        ...state,
        levelProgress: state.levelProgress.map(progress => 
          progress.levelId === action.levelId 
            ? { ...progress, completed: false, attempts: 0, correctAnswers: 0 }
            : progress
        )
      };

    case 'END_GAME':
      return {
        ...state,
        isPlaying: false,
        currentProblem: null
      };

    default:
      return state;
  }
}

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();

  // Timer effect
  useEffect(() => {
    if (state.isPlaying && state.timeRemaining > 0) {
      const timer = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);

      return () => clearInterval(timer);
    } else if (state.timeRemaining === 0 && state.isPlaying) {
      // Time's up
      toast({
        title: "Time's Up!",
        description: "Moving to next problem...",
        variant: "destructive"
      });
    }
  }, [state.isPlaying, state.timeRemaining]);

  const startGame = () => {
    dispatch({ type: 'START_GAME' });
    // Navigate to level selection
    dispatch({ type: 'SELECT_LEVEL', levelId: 0 });
    emitAnalytics({
      type: 'game_start',
      timestamp: Date.now(),
      data: { difficulty: state.gameSettings.difficulty }
    });
  };

  const selectLevel = (levelId: number) => {
    dispatch({ type: 'SELECT_LEVEL', levelId });
    
    // Only generate problems for actual game levels (not level selection)
    if (levelId > 0) {
      // Reset level progress when starting
      dispatch({ type: 'RESET_LEVEL', levelId });
      
      const levelConfig = LEVEL_CONFIGS.find(l => l.id === levelId);
      if (levelConfig) {
        const problem = levelConfig.problemGenerator(Date.now());
        dispatch({ type: 'LOAD_PROBLEM', problem });
        
        emitAnalytics({
          type: 'level_start',
          timestamp: Date.now(),
          data: { levelId, problemId: problem.id }
        });
      }
    }
  };

  const submitAnswer = (answer: any) => {
    if (!state.currentProblem) return;

    // Validate answer using the problem's validation logic
    const isCorrect = validateAnswer(answer, state.currentProblem);
    const scoreDelta = isCorrect ? state.currentProblem.maxScore : -3;

    dispatch({ type: 'SUBMIT_ANSWER', answer, isCorrect, scoreDelta });

    // Show feedback
    if (isCorrect) {
      soundEngine.playCorrect();
      toast({
        title: "Correct! 🎉",
        description: `+${state.currentProblem.maxScore} points`,
        variant: "default"
      });
    } else {
      soundEngine.playIncorrect();
      toast({
        title: "Not quite right 😔",
        description: "Try again or use a hint!",
        variant: "destructive"
      });
    }

    emitAnalytics({
      type: 'attempt_result',
      timestamp: Date.now(),
      data: {
        problemId: state.currentProblem.id,
        correct: isCorrect,
        scoreDelta,
        timeRemaining: state.timeRemaining
      }
    });

    // Check level completion
    const currentProgress = state.levelProgress.find(p => p.levelId === state.currentLevel);
    const newCorrectCount = currentProgress ? currentProgress.correctAnswers + (isCorrect ? 1 : 0) : (isCorrect ? 1 : 0);
    
    if (newCorrectCount >= 5) {
      setTimeout(() => {
        dispatch({ type: 'LEVEL_COMPLETE', levelId: state.currentLevel });
        toast({
          title: "Level Complete! 🌟",
          description: "Great job! Next level unlocked!",
          variant: "default"
        });
      }, 1000);
    }
  };

  const useHint = () => {
    if (!state.gameSettings.hintsEnabled) return;
    
    // Implementation depends on current problem type
    emitAnalytics({
      type: 'hint_used',
      timestamp: Date.now(),
      data: { problemId: state.currentProblem?.id }
    });
  };

  const nextProblem = () => {
    if (!state.currentLevel) return;
    
    const levelConfig = LEVEL_CONFIGS.find(l => l.id === state.currentLevel);
    if (levelConfig) {
      const problem = levelConfig.problemGenerator(Date.now() + Math.random() * 1000);
      dispatch({ type: 'LOAD_PROBLEM', problem });
    }
  };

  const endGame = () => {
    dispatch({ type: 'END_GAME' });
    emitAnalytics({
      type: 'game_end',
      timestamp: Date.now(),
      data: { 
        finalScore: state.score,
        levelsCompleted: state.levelProgress.filter(p => p.completed).length
      }
    });
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings });
  };

  const emitAnalytics = (event: AnalyticsEvent) => {
    // In a real app, this would send to an analytics service
    console.log('Analytics:', event);
  };

  const validateAnswer = (answer: any, problem: Problem): boolean => {
    return FractionMath.validateAnswer(answer, problem.correctAnswer);
  };

  const contextValue: GameContextType = {
    state,
    startGame,
    selectLevel,
    submitAnswer,
    useHint,
    nextProblem,
    endGame,
    updateSettings,
    emitAnalytics
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};