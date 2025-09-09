// Simple WebAudio sound engine for game feedback

export class SoundEngine {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    // Envelope for smooth start/stop
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Game event sounds
  playCorrect() {
    // Happy ascending melody
    this.createTone(523.25, 0.15); // C5
    setTimeout(() => this.createTone(659.25, 0.15), 100); // E5
    setTimeout(() => this.createTone(783.99, 0.3), 200); // G5
  }

  playIncorrect() {
    // Descending sad tone
    this.createTone(329.63, 0.2, 'sawtooth'); // E4
    setTimeout(() => this.createTone(293.66, 0.3, 'sawtooth'), 150); // D4
  }

  playLevelComplete() {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => this.createTone(note, 0.4), index * 100);
    });
  }

  playButtonClick() {
    this.createTone(800, 0.1, 'square');
  }

  playHint() {
    this.createTone(440, 0.2, 'triangle');
  }

  playTimeWarning() {
    // Urgent beep
    this.createTone(1000, 0.1);
    setTimeout(() => this.createTone(1000, 0.1), 200);
  }

  playGameStart() {
    // Uplifting chord progression
    this.createTone(261.63, 0.5); // C4
    setTimeout(() => this.createTone(329.63, 0.5), 0); // E4
    setTimeout(() => this.createTone(392.00, 0.5), 0); // G4
  }

  // Background music loop (simple ambient tones)
  private musicInterval: number | null = null;

  startBackgroundMusic() {
    if (!this.enabled || this.musicInterval) return;

    const playAmbientTone = () => {
      const frequencies = [130.81, 146.83, 164.81, 174.61]; // C3, D3, E3, F3
      const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
      this.createTone(randomFreq, 2.0, 'sine');
    };

    // Play ambient tone every 3 seconds
    this.musicInterval = window.setInterval(playAmbientTone, 3000);
    playAmbientTone(); // Play immediately
  }

  stopBackgroundMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  // Clean up
  dispose() {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

// Global sound engine instance
export const soundEngine = new SoundEngine();