// Game Types for Fraction Quest

export interface GameState {
  currentLevel: number;
  score: number;
  timeRemaining: number;
  isPlaying: boolean;
  currentProblem: Problem | null;
  levelProgress: LevelProgress[];
  gameSettings: GameSettings;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  score: number;
  attempts: number;
  correctAnswers: number;
  timeSpent: number;
  unlocked: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  hintsEnabled: boolean;
}

export interface Problem {
  id: string;
  type: 'share' | 'add' | 'subtract' | 'simplify' | 'convert' | 'word';
  level: number;
  assets: 'laddus' | 'cake' | 'pizza';
  params: any;
  question: string;
  correctAnswer: Fraction | MixedNumber;
  hints: string[];
  timeLimit: number;
  maxScore: number;
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface MixedNumber {
  whole: number;
  fraction: Fraction;
}

export interface DragItem {
  id: string;
  type: 'laddu' | 'cake-slice' | 'pizza-slice';
  value: number;
  position: { x: number; y: number };
  isDragging: boolean;
}

export interface DropZone {
  id: string;
  type: 'plate' | 'friend' | 'fraction-builder';
  position: { x: number; y: number };
  items: DragItem[];
  maxItems?: number;
  accepts: string[];
}

export interface GameAnalytics {
  sessionId: string;
  events: AnalyticsEvent[];
}

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  data: any;
}

// Math utility types
export interface FractionCalculation {
  operands: Fraction[];
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  result: Fraction;
  steps: string[];
}

export interface LevelConfig {
  id: number;
  title: string;
  description: string;
  objective: string;
  timeLimit: number;
  passingScore: number;
  problemCount: number;
  problemGenerator: (seed: number) => Problem;
}