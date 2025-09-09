// Game settings component

import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGame } from './GameEngine';
import { soundEngine } from '../utils/soundEngine';
import { Settings as SettingsIcon, Volume2, VolumeX, Music } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings } = useGame();

  if (!isOpen) return null;

  const handleSoundToggle = (enabled: boolean) => {
    updateSettings({ soundEnabled: enabled });
    soundEngine.setEnabled(enabled);
    if (enabled) {
      soundEngine.playButtonClick();
    }
  };

  const handleMusicToggle = (enabled: boolean) => {
    updateSettings({ musicEnabled: enabled });
    if (enabled) {
      soundEngine.startBackgroundMusic();
    } else {
      soundEngine.stopBackgroundMusic();
    }
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard') => {
    updateSettings({ difficulty });
    soundEngine.playButtonClick();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="game-card p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Game Settings</span>
          </h2>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Audio</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects" className="flex items-center space-x-2">
                {state.gameSettings.soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                <span>Sound Effects</span>
              </Label>
              <Switch
                id="sound-effects"
                checked={state.gameSettings.soundEnabled}
                onCheckedChange={handleSoundToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="background-music" className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Background Music</span>
              </Label>
              <Switch
                id="background-music"
                checked={state.gameSettings.musicEnabled}
                onCheckedChange={handleMusicToggle}
              />
            </div>
          </div>

          {/* Difficulty Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Difficulty</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
                <Button
                  key={diff}
                  variant={state.gameSettings.difficulty === diff ? 'default' : 'outline'}
                  onClick={() => handleDifficultyChange(diff)}
                  className="capitalize"
                >
                  {diff}
                </Button>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              {state.gameSettings.difficulty === 'easy' && 'Smaller numbers, more time'}
              {state.gameSettings.difficulty === 'medium' && 'Balanced challenge'}
              {state.gameSettings.difficulty === 'hard' && 'Complex problems, less time'}
            </p>
          </div>

          {/* Accessibility */}
          <div className="space-y-4">
            <h3 className="font-semibold">Accessibility</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="hints-enabled">
                <span>Enable Hints</span>
              </Label>
              <Switch
                id="hints-enabled"
                checked={state.gameSettings.hintsEnabled}
                onCheckedChange={(enabled) => updateSettings({ hintsEnabled: enabled })}
              />
            </div>
          </div>

          {/* Reset Progress */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Reset Progress</h3>
            <p className="text-sm text-gray-600 mb-3">
              This will clear all level progress and scores.
            </p>
            <Button variant="destructive" className="w-full">
              Reset All Progress
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;