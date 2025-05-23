
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onAnalyze: () => void;
  analyzing: boolean;
  disabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAnalyze,
  analyzing,
  disabled
}) => {
  return (
    <div className="mt-6 flex justify-end">
      <Button
        onClick={onAnalyze}
        className="juridika-btn-primary"
        disabled={disabled || analyzing}
      >
        {analyzing ? 'Analyserar...' : 'Analysera valda dokument'}
      </Button>
    </div>
  );
};

export default ActionButtons;
