import { useEffect } from 'react';

/**
 * Close a modal / overlay when the user presses Escape. Mirrors the WAI-ARIA
 * dialog pattern (Escape dismisses a modal).
 *
 * Usage:
 *   useEscapeClose(isOpen, onClose);
 *
 * Restores focus to the previously-focused element on close — basic focus
 * management without a full focus trap (still a major keyboard-a11y improvement
 * over no Escape handling at all).
 */
export function useEscapeClose(
  isOpen: boolean,
  onClose: () => void,
) {
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      try {
        previouslyFocused?.focus?.();
      } catch {
        // focus() can throw on non-HTML elements; ignore.
      }
    };
  }, [isOpen, onClose]);
}
