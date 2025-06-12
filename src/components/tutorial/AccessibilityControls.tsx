
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Sun, Moon } from 'lucide-react';

interface AccessibilityControlsProps {
  fontSize: number;
  highContrast: boolean;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  onToggleHighContrast: () => void;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  fontSize,
  highContrast,
  onIncreaseFontSize,
  onDecreaseFontSize,
  onToggleHighContrast
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDecreaseFontSize}
        aria-label="Réduire la taille du texte"
        className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onIncreaseFontSize}
        aria-label="Augmenter la taille du texte"
        className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleHighContrast}
        aria-label={highContrast ? "Désactiver le mode contraste élevé" : "Activer le mode contraste élevé"}
        className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
      >
        {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </div>
  );
};
