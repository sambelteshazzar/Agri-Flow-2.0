import React from 'react';
import { X, Lightbulb, Check } from 'lucide-react';
import { Suggestion } from './types';

interface CropSuggestionProps {
  suggestion: Suggestion;
  onConfirm: () => void;
  onDismiss: () => void;
}

const CropSuggestion: React.FC<CropSuggestionProps> = ({ suggestion, onConfirm, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-[55] max-w-sm w-full animate-fade-in-up">
      <div className="bg-terra-900 dark:bg-jade-950 border-l-4 border-sunburst-500 rounded-r-lg shadow-2xl p-4 text-white relative">
        <button
          onClick={onDismiss}
          aria-label="Dismiss suggestion"
          className="absolute top-2 right-2 text-[var(--text-tertiary)] hover:text-white"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3">
          <div className="bg-sunburst-500/20 p-2 rounded-full">
            <Lightbulb className="w-5 h-5 text-sunburst-500 animate-pulse" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-sunburst-500 mb-1">Smart Insight</h4>
            <p className="text-sm font-medium mb-2">
              Your crop looks like it needs an update — <span className="font-bold text-white">{suggestion.cropName}</span> status should be updated to <span className="font-bold text-sunburst-400">{suggestion.suggestedStatus}</span>.
            </p>
            <p className="text-xs text-[var(--text-tertiary)] italic mb-3">"{suggestion.reason}"</p>

            <div className="flex gap-2">
              <button
                onClick={onConfirm}
                className="bg-sunburst-500 hover:bg-sunburst-400 text-jade-950 px-3 py-1.5 rounded text-xs font-semibold flex items-center"
              >
                <Check className="w-3 h-3 mr-1" /> Update Status
              </button>
              <button
                onClick={onDismiss}
                className="bg-transparent border border-jade-600 text-[var(--text-tertiary)] hover:text-white hover:border-jade-400 px-3 py-1.5 rounded text-xs font-semibold"
              >
                Ignore
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestion;
