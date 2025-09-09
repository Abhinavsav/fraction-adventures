// Robust fraction mathematics utilities using integer arithmetic

import { Fraction, MixedNumber } from '../types/game';

export class FractionMath {
  /**
   * Calculate GCD using Euclidean algorithm
   */
  static gcd(a: number, b: number): number {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }

  /**
   * Calculate LCM of two numbers
   */
  static lcm(a: number, b: number): number {
    return Math.abs(a * b) / this.gcd(a, b);
  }

  /**
   * Reduce fraction to simplest form
   */
  static reduce(fraction: Fraction): Fraction {
    const g = this.gcd(fraction.numerator, fraction.denominator);
    return {
      numerator: fraction.numerator / g,
      denominator: fraction.denominator / g
    };
  }

  /**
   * Check if two fractions are equivalent
   */
  static areEqual(a: Fraction, b: Fraction): boolean {
    const reducedA = this.reduce(a);
    const reducedB = this.reduce(b);
    return reducedA.numerator === reducedB.numerator && 
           reducedA.denominator === reducedB.denominator;
  }

  /**
   * Add two fractions
   */
  static add(a: Fraction, b: Fraction): Fraction {
    const commonDenominator = this.lcm(a.denominator, b.denominator);
    const numeratorA = a.numerator * (commonDenominator / a.denominator);
    const numeratorB = b.numerator * (commonDenominator / b.denominator);
    
    return this.reduce({
      numerator: numeratorA + numeratorB,
      denominator: commonDenominator
    });
  }

  /**
   * Subtract two fractions
   */
  static subtract(a: Fraction, b: Fraction): Fraction {
    const commonDenominator = this.lcm(a.denominator, b.denominator);
    const numeratorA = a.numerator * (commonDenominator / a.denominator);
    const numeratorB = b.numerator * (commonDenominator / b.denominator);
    
    return this.reduce({
      numerator: numeratorA - numeratorB,
      denominator: commonDenominator
    });
  }

  /**
   * Convert improper fraction to mixed number
   */
  static toMixedNumber(fraction: Fraction): MixedNumber {
    const reduced = this.reduce(fraction);
    const whole = Math.floor(reduced.numerator / reduced.denominator);
    const remainder = reduced.numerator % reduced.denominator;
    
    return {
      whole,
      fraction: {
        numerator: remainder,
        denominator: reduced.denominator
      }
    };
  }

  /**
   * Convert mixed number to improper fraction
   */
  static toImproperFraction(mixed: MixedNumber): Fraction {
    return {
      numerator: mixed.whole * mixed.fraction.denominator + mixed.fraction.numerator,
      denominator: mixed.fraction.denominator
    };
  }

  /**
   * Convert fraction to decimal
   */
  static toDecimal(fraction: Fraction): number {
    return fraction.numerator / fraction.denominator;
  }

  /**
   * Parse fraction from string "3/4" or "1 1/2"
   */
  static parseFromString(str: string): Fraction | MixedNumber | null {
    str = str.trim();
    
    // Mixed number format: "1 1/2"
    const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
    if (mixedMatch) {
      return {
        whole: parseInt(mixedMatch[1]),
        fraction: {
          numerator: parseInt(mixedMatch[2]),
          denominator: parseInt(mixedMatch[3])
        }
      };
    }
    
    // Simple fraction format: "3/4"
    const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
    if (fractionMatch) {
      return {
        numerator: parseInt(fractionMatch[1]),
        denominator: parseInt(fractionMatch[2])
      };
    }
    
    return null;
  }

  /**
   * Format fraction for display
   */
  static formatFraction(fraction: Fraction): string {
    const reduced = this.reduce(fraction);
    if (reduced.denominator === 1) {
      return reduced.numerator.toString();
    }
    return `${reduced.numerator}/${reduced.denominator}`;
  }

  /**
   * Format mixed number for display
   */
  static formatMixedNumber(mixed: MixedNumber): string {
    if (mixed.whole === 0) {
      return this.formatFraction(mixed.fraction);
    }
    if (mixed.fraction.numerator === 0) {
      return mixed.whole.toString();
    }
    return `${mixed.whole} ${this.formatFraction(mixed.fraction)}`;
  }

  /**
   * Check if fraction is improper
   */
  static isImproper(fraction: Fraction): boolean {
    return fraction.numerator >= fraction.denominator;
  }

  /**
   * Generate equivalent fractions
   */
  static generateEquivalents(fraction: Fraction, count: number = 3): Fraction[] {
    const reduced = this.reduce(fraction);
    const equivalents: Fraction[] = [];
    
    for (let i = 2; i <= count + 1; i++) {
      equivalents.push({
        numerator: reduced.numerator * i,
        denominator: reduced.denominator * i
      });
    }
    
    return equivalents;
  }

  /**
   * Validate a player's answer against the correct answer
   */
  static validateAnswer(
    playerAnswer: Fraction | MixedNumber | string,
    correctAnswer: Fraction | MixedNumber
  ): boolean {
    // Convert string input
    if (typeof playerAnswer === 'string') {
      const parsed = this.parseFromString(playerAnswer);
      if (!parsed) return false;
      playerAnswer = parsed;
    }

    // Convert both to fractions for comparison
    let playerFraction: Fraction;
    let correctFraction: Fraction;

    if ('whole' in playerAnswer) {
      playerFraction = this.toImproperFraction(playerAnswer);
    } else {
      playerFraction = playerAnswer;
    }

    if ('whole' in correctAnswer) {
      correctFraction = this.toImproperFraction(correctAnswer);
    } else {
      correctFraction = correctAnswer;
    }

    return this.areEqual(playerFraction, correctFraction);
  }
}