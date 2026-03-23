/**
 * PauseMenu - In-game pause overlay with resume, settings, and quit options.
 */

import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import { SettingsPanel } from './SettingsPanel';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onQuit: () => void;
}

export function PauseMenu({ isOpen, onResume, onQuit }: PauseMenuProps) {
  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsPanel onClose={() => setShowSettings(false)} />;
  }

  return (
    <Modal isOpen={isOpen} onClose={onResume} title="Paused">
      <div className="flex flex-col gap-3 items-center py-4">
        <Button variant="primary" size="lg" onClick={onResume}>
          Resume
        </Button>
        <Button variant="outline" size="lg" onClick={() => setShowSettings(true)}>
          Settings
        </Button>
        <Button variant="danger" size="lg" onClick={onQuit}>
          Quit to Menu
        </Button>
      </div>
    </Modal>
  );
}
