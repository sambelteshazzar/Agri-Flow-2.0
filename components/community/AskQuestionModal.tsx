import React from 'react';
import { X, HelpCircle, Sparkles } from 'lucide-react';

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  newQuestion: { title: string; body: string; category: string };
  setNewQuestion: (q: { title: string; body: string; category: string }) => void;
  onSubmit: () => void;
}

const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen, onClose, newQuestion, setNewQuestion, onSubmit,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-jade-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--bg-card)] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border-card)] flex justify-between items-center bg-amber-50 dark:bg-amber-950/20">
          <h3 className="font-bold text-amber-900 dark:text-amber-200 text-lg flex items-center gap-2"><HelpCircle className="w-5 h-5" /> Ask a Question</h3>
          <button onClick={onClose} aria-label="Close" className="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] p-1 rounded-full"><X className="w-5 h-5" aria-hidden="true"/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Category</label>
            <select value={newQuestion.category} onChange={e => setNewQuestion({...newQuestion, category: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-semibold outline-none text-[var(--text-primary)] text-sm">
              <option value="General">General</option>
              <option value="Crops">Crops</option>
              <option value="Pests">Pests</option>
              <option value="Livestock">Livestock</option>
              <option value="Equipment">Equipment</option>
              <option value="Soil">Soil & Fertilizer</option>
              <option value="Market">Market & Prices</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Question</label>
            <input placeholder="e.g. How do you prevent fall armyworm in maize?" value={newQuestion.title} onChange={e => setNewQuestion({...newQuestion, title: e.target.value})} className="w-full p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-bold outline-none text-[var(--text-primary)] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Details</label>
            <textarea placeholder="Provide more context about your question..." value={newQuestion.body} onChange={e => setNewQuestion({...newQuestion, body: e.target.value})} className="w-full h-28 p-3 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl font-medium outline-none text-[var(--text-primary)] text-sm resize-none" />
          </div>
        </div>
        <div className="px-6 py-4 bg-[var(--bg-content)] border-t border-[var(--border-card)] flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-semibold text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-content)] transition-colors">Cancel</button>
          <button onClick={onSubmit} disabled={!newQuestion.title.trim()} className="bg-amber-600 text-white px-6 py-2.5 rounded-xl font-semibold text-xs hover:bg-amber-700 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"><Sparkles className="w-4 h-4" /> Post Question</button>
        </div>
      </div>
    </div>
  );
};

export default AskQuestionModal;
