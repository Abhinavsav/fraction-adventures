// Problem generation system for all 5 levels

import { Problem, Fraction, MixedNumber, LevelConfig } from '../types/game';
import { FractionMath } from './fractionMath';

export class ProblemGenerator {
  private static seedRandom(seed: number): () => number {
    let state = seed;
    return () => {
      state = (state * 1103515245 + 12345) & 0x7fffffff;
      return state / 0x7fffffff;
    };
  }

  private static randomInt(min: number, max: number, random: () => number): number {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  private static randomChoice<T>(array: T[], random: () => number): T {
    return array[Math.floor(random() * array.length)];
  }

  /**
   * Level 1: Sharing & Improper Fractions
   */
  static generateLevel1Problem(seed: number): Problem {
    const random = this.seedRandom(seed);
    const N = this.randomInt(5, 30, random); // items to share
    const F = this.randomInt(2, 8, random);  // friends
    const assets = this.randomChoice(['laddus', 'cake'], random);
    
    const perFriend = N / F;
    const correctAnswer: MixedNumber = FractionMath.toMixedNumber({
      numerator: N,
      denominator: F
    });

    return {
      id: `l1_${seed}`,
      type: 'share',
      level: 1,
      assets: assets as any,
      params: { N, F },
      question: `Share ${N} ${assets} equally among ${F} friends. How much does each friend get?`,
      correctAnswer,
      hints: [
        "Try grouping the items into equal piles",
        "Some items might be left over - that becomes the fractional part",
        `Divide ${N} by ${F} to find each friend's share`
      ],
      timeLimit: 90,
      maxScore: 10
    };
  }

  /**
   * Level 2: Fraction Addition & Subtraction
   */
  static generateLevel2Problem(seed: number): Problem {
    const random = this.seedRandom(seed);
    const operation = this.randomChoice(['add', 'subtract'], random);
    
    // Generate fractions with denominators 2-12
    const denom1 = this.randomInt(2, 12, random);
    const denom2 = this.randomInt(2, 12, random);
    const num1 = this.randomInt(1, denom1 - 1, random);
    const num2 = this.randomInt(1, denom2 - 1, random);
    
    const frac1: Fraction = { numerator: num1, denominator: denom1 };
    const frac2: Fraction = { numerator: num2, denominator: denom2 };
    
    const correctAnswer = operation === 'add' 
      ? FractionMath.add(frac1, frac2)
      : FractionMath.subtract(frac1, frac2);
    
    const operatorSymbol = operation === 'add' ? '+' : '-';
    const question = `${FractionMath.formatFraction(frac1)} ${operatorSymbol} ${FractionMath.formatFraction(frac2)} = ?`;

    return {
      id: `l2_${seed}`,
      type: operation as any,
      level: 2,
      assets: 'cake',
      params: { frac1, frac2, operation },
      question,
      correctAnswer,
      hints: [
        "Find a common denominator for both fractions",
        `The LCM of ${denom1} and ${denom2} is ${FractionMath.lcm(denom1, denom2)}`,
        "Convert both fractions, then add/subtract the numerators"
      ],
      timeLimit: 90,
      maxScore: 12
    };
  }

  /**
   * Level 3: Equivalent Fractions & Simplification
   */
  static generateLevel3Problem(seed: number): Problem {
    const random = this.seedRandom(seed);
    const taskType = this.randomChoice(['simplify', 'equivalent'], random);
    
    if (taskType === 'simplify') {
      // Generate a fraction that can be simplified
      const baseDenom = this.randomInt(3, 12, random);
      const baseNum = this.randomInt(2, baseDenom - 1, random);
      const multiplier = this.randomInt(2, 6, random);
      
      const unsimplified: Fraction = {
        numerator: baseNum * multiplier,
        denominator: baseDenom * multiplier
      };
      
      const correctAnswer = FractionMath.reduce(unsimplified);
      
      return {
        id: `l3_${seed}`,
        type: 'simplify',
        level: 3,
        assets: 'pizza',
        params: { fraction: unsimplified },
        question: `Simplify ${FractionMath.formatFraction(unsimplified)}`,
        correctAnswer,
        hints: [
          `Find the GCD of ${unsimplified.numerator} and ${unsimplified.denominator}`,
          `Both numbers are divisible by ${FractionMath.gcd(unsimplified.numerator, unsimplified.denominator)}`,
          "Divide both numerator and denominator by their GCD"
        ],
        timeLimit: 75,
        maxScore: 10
      };
    } else {
      // Generate equivalent fraction problem
      const baseFrac: Fraction = {
        numerator: this.randomInt(1, 8, random),
        denominator: this.randomInt(2, 9, random)
      };
      
      const equivalents = FractionMath.generateEquivalents(baseFrac, 4);
      const correctAnswer = this.randomChoice(equivalents, random);
      
      return {
        id: `l3_${seed}`,
        type: 'simplify',
        level: 3,
        assets: 'cake',
        params: { baseFraction: baseFrac, options: equivalents },
        question: `Which fraction is equivalent to ${FractionMath.formatFraction(baseFrac)}?`,
        correctAnswer,
        hints: [
          "Equivalent fractions represent the same value",
          "Multiply or divide both parts by the same number",
          `Try multiplying ${baseFrac.numerator} and ${baseFrac.denominator} by the same number`
        ],
        timeLimit: 75,
        maxScore: 10
      };
    }
  }

  /**
   * Level 4: Mixed Numbers & Conversion
   */
  static generateLevel4Problem(seed: number): Problem {
    const random = this.seedRandom(seed);
    const conversionType = this.randomChoice(['improper_to_mixed', 'mixed_to_improper'], random);
    
    if (conversionType === 'improper_to_mixed') {
      const denominator = this.randomInt(2, 8, random);
      const numerator = this.randomInt(denominator + 1, denominator * 6, random);
      
      const improperFraction: Fraction = { numerator, denominator };
      const correctAnswer = FractionMath.toMixedNumber(improperFraction);
      
      return {
        id: `l4_${seed}`,
        type: 'convert',
        level: 4,
        assets: 'laddus',
        params: { fraction: improperFraction, conversionType },
        question: `Convert ${FractionMath.formatFraction(improperFraction)} to a mixed number`,
        correctAnswer,
        hints: [
          `Divide ${numerator} by ${denominator}`,
          "The quotient becomes the whole number part",
          "The remainder becomes the new numerator"
        ],
        timeLimit: 90,
        maxScore: 12
      };
    } else {
      const whole = this.randomInt(1, 8, random);
      const denominator = this.randomInt(2, 8, random);
      const numerator = this.randomInt(1, denominator - 1, random);
      
      const mixedNumber: MixedNumber = {
        whole,
        fraction: { numerator, denominator }
      };
      
      const correctAnswer = FractionMath.toImproperFraction(mixedNumber);
      
      return {
        id: `l4_${seed}`,
        type: 'convert',
        level: 4,
        assets: 'cake',
        params: { mixedNumber, conversionType },
        question: `Convert ${FractionMath.formatMixedNumber(mixedNumber)} to an improper fraction`,
        correctAnswer,
        hints: [
          `Multiply the whole number by the denominator: ${whole} × ${denominator}`,
          `Add the numerator: (${whole} × ${denominator}) + ${numerator}`,
          "Keep the same denominator"
        ],
        timeLimit: 90,
        maxScore: 12
      };
    }
  }

  /**
   * Level 5: Applied Word Problems
   */
  static generateLevel5Problem(seed: number): Problem {
    const random = this.seedRandom(seed);
    const problemType = this.randomChoice(['recipe', 'sharing', 'multi_step'], random);
    
    if (problemType === 'recipe') {
      const totalCups = this.randomInt(3, 8, random) / 4; // 3/4, 1, 5/4, etc.
      const usedCups = this.randomInt(1, Math.floor(totalCups * 4) - 1, random) / 4;
      
      const total: Fraction = { numerator: Math.round(totalCups * 4), denominator: 4 };
      const used: Fraction = { numerator: Math.round(usedCups * 4), denominator: 4 };
      const correctAnswer = FractionMath.subtract(total, used);
      
      return {
        id: `l5_${seed}`,
        type: 'word',
        level: 5,
        assets: 'cake',
        params: { total, used, problemType },
        question: `A recipe requires ${FractionMath.formatFraction(total)} cups of sugar. You have already used ${FractionMath.formatFraction(used)} cups. How much more sugar do you need?`,
        correctAnswer,
        hints: [
          "This is a subtraction problem",
          `Subtract ${FractionMath.formatFraction(used)} from ${FractionMath.formatFraction(total)}`,
          "Find a common denominator if needed"
        ],
        timeLimit: 120,
        maxScore: 15
      };
    } else if (problemType === 'sharing') {
      const pizzas = this.randomInt(2, 4, random);
      const slicesPerPizza = 8;
      const guests = this.randomInt(3, 6, random);
      const slicesPerGuest = this.randomInt(2, 4, random);
      
      const totalSlices = pizzas * slicesPerPizza;
      const usedSlices = guests * slicesPerGuest;
      const remaining = totalSlices - usedSlices;
      
      const correctAnswer: Fraction = { numerator: remaining, denominator: slicesPerPizza };
      
      return {
        id: `l5_${seed}`,
        type: 'word',
        level: 5,
        assets: 'pizza',
        params: { pizzas, guests, slicesPerGuest, problemType },
        question: `You have ${pizzas} pizzas cut into eighths. You give ${slicesPerGuest}/8 of a pizza to each of ${guests} guests. How much pizza remains? (Express as a fraction of one whole pizza)`,
        correctAnswer,
        hints: [
          `Total slices: ${pizzas} × 8 = ${totalSlices}`,
          `Slices given away: ${guests} × ${slicesPerGuest} = ${usedSlices}`,
          `Remaining slices: ${totalSlices} - ${usedSlices} = ${remaining}`
        ],
        timeLimit: 120,
        maxScore: 15
      };
    } else {
      // Multi-step problem
      const frac1: Fraction = { numerator: this.randomInt(1, 5, random), denominator: 6 };
      const frac2: Fraction = { numerator: this.randomInt(1, 7, random), denominator: 8 };
      const frac3: Fraction = { numerator: 1, denominator: 4 };
      
      const step1 = FractionMath.add(frac1, frac2);
      const correctAnswer = FractionMath.subtract(step1, frac3);
      
      return {
        id: `l5_${seed}`,
        type: 'word',
        level: 5,
        assets: 'cake',
        params: { frac1, frac2, frac3, problemType },
        question: `Calculate: (${FractionMath.formatFraction(frac1)} + ${FractionMath.formatFraction(frac2)}) - ${FractionMath.formatFraction(frac3)}`,
        correctAnswer,
        hints: [
          "Solve step by step: first add the fractions in parentheses",
          `${FractionMath.formatFraction(frac1)} + ${FractionMath.formatFraction(frac2)} = ${FractionMath.formatFraction(step1)}`,
          `Then subtract: ${FractionMath.formatFraction(step1)} - ${FractionMath.formatFraction(frac3)}`
        ],
        timeLimit: 120,
        maxScore: 15
      };
    }
  }
}

// Level configurations
export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    id: 1,
    title: "Sharing & Improper Fractions",
    description: "Learn to share items equally and understand mixed numbers",
    objective: "Share items equally among friends and express as mixed numbers",
    timeLimit: 90,
    passingScore: 40,
    problemCount: 5,
    problemGenerator: ProblemGenerator.generateLevel1Problem
  },
  {
    id: 2,
    title: "Fraction Addition & Subtraction",
    description: "Add and subtract fractions with visual models",
    objective: "Add and subtract fractions using common denominators",
    timeLimit: 90,
    passingScore: 50,
    problemCount: 5,
    problemGenerator: ProblemGenerator.generateLevel2Problem
  },
  {
    id: 3,
    title: "Equivalent Fractions & Simplification",
    description: "Recognize equivalent fractions and simplify",
    objective: "Simplify fractions and identify equivalent forms",
    timeLimit: 75,
    passingScore: 40,
    problemCount: 5,
    problemGenerator: ProblemGenerator.generateLevel3Problem
  },
  {
    id: 4,
    title: "Mixed Numbers & Conversion",
    description: "Convert between improper fractions and mixed numbers",
    objective: "Master conversion between fraction forms",
    timeLimit: 90,
    passingScore: 50,
    problemCount: 5,
    problemGenerator: ProblemGenerator.generateLevel4Problem
  },
  {
    id: 5,
    title: "Applied Word Problems",
    description: "Solve real-world problems using fractions",
    objective: "Apply fraction skills to practical scenarios",
    timeLimit: 120,
    passingScore: 60,
    problemCount: 4,
    problemGenerator: ProblemGenerator.generateLevel5Problem
  }
];