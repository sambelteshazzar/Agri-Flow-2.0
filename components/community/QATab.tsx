import React from 'react';
import { Search, HelpCircle, ThumbsUp, CheckCircle, MessageCircle, Shield, Sparkles, Leaf, Bug, Wheat, Wrench, Droplets, TrendingUp, Tag } from 'lucide-react';
import { UserProfile } from '@/types';
import { Question, Answer } from './types';

const QA_CATEGORIES = [
  { key: 'ALL', label: 'All', icon: Tag },
  { key: 'Crops', label: 'Crops', icon: Wheat },
  { key: 'Pests', label: 'Pests', icon: Bug },
  { key: 'Livestock', label: 'Livestock', icon: Leaf },
  { key: 'Equipment', label: 'Equipment', icon: Wrench },
  { key: 'Soil', label: 'Soil & Fertilizer', icon: Droplets },
  { key: 'Market', label: 'Market & Prices', icon: TrendingUp },
];

interface QATabProps {
  questions: Question[];
  filteredQuestions: Question[];
  expandedQuestionId: string | null;
  setExpandedQuestionId: (id: string | null) => void;
  newAnswer: string;
  setNewAnswer: (v: string) => void;
  isSignedIn: boolean;
  userProfile: UserProfile;
  qaSearchQuery: string;
  setQaSearchQuery: (q: string) => void;
  qaCategoryFilter: string;
  setQaCategoryFilter: (c: string) => void;
  onLikeQuestion: (id: string) => void;
  onAcceptAnswer: (questionId: string, answerId: string) => void;
  onAnswerSubmit: (questionId: string) => void;
  setIsQuestionModalOpen: (v: boolean) => void;
  handleAuthRequiredAction: (action: () => void) => void;
  getRelativeTime: (dateString: string) => string;
}

const QATab: React.FC<QATabProps> = ({
  questions, filteredQuestions,
  expandedQuestionId, setExpandedQuestionId,
  newAnswer, setNewAnswer,
  isSignedIn, userProfile,
  qaSearchQuery, setQaSearchQuery,
  qaCategoryFilter, setQaCategoryFilter,
  onLikeQuestion, onAcceptAnswer, onAnswerSubmit,
  setIsQuestionModalOpen, handleAuthRequiredAction,
  getRelativeTime,
}) => (
  <div className="pt-4 lg:pt-0 space-y-6">
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
      <div>
        <h3 className="text-2xl font-semibold text-[var(--text-primary)] font-heading">Q&A Hub</h3>
        <p className="text-[var(--text-secondary)] text-xs font-semibold mt-1">Ask questions, get expert answers, share knowledge</p>
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input value={qaSearchQuery} onChange={e => setQaSearchQuery(e.target.value)} placeholder="Search questions..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl text-sm focus:outline-none focus:border-sunburst-500" />
        </div>
        <button onClick={() => handleAuthRequiredAction(() => setIsQuestionModalOpen(true))} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95 shrink-0"><HelpCircle className="w-4 h-4"/> Ask</button>
      </div>
    </div>

    <div className="flex gap-3 px-1 overflow-x-auto no-scrollbar">
      {QA_CATEGORIES.map(cat => {
        const Icon = cat.icon;
        const count = cat.key === 'ALL'
          ? questions.length
          : questions.filter(q => q.category === cat.key).length;
        return (
          <button
            key={cat.key}
            onClick={() => setQaCategoryFilter(cat.key)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
              qaCategoryFilter === cat.key
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-card)] hover:border-amber-400'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {cat.label}
            {count > 0 && <span className={`ml-0.5 text-[10px] ${qaCategoryFilter === cat.key ? 'text-amber-200' : 'text-[var(--text-tertiary)]'}`}>({count})</span>}
          </button>
        );
      })}
    </div>

    <div className="flex gap-3 px-1 overflow-x-auto no-scrollbar">
      <div className="bg-jade-50 dark:bg-jade-950/20 border border-jade-200 dark:border-jade-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
        <CheckCircle className="w-4 h-4 text-jade-600" />
        <span className="text-xs font-bold text-jade-800 dark:text-jade-200">{questions.filter(q => q.solved).length} Solved</span>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
        <HelpCircle className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-bold text-amber-800 dark:text-amber-200">{questions.filter(q => !q.solved).length} Open</span>
      </div>
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2 flex items-center gap-2 shrink-0">
        <Shield className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-bold text-blue-800 dark:text-blue-200">{questions.reduce((c, q) => c + q.answers.filter(a => a.isExpert).length, 0)} Expert Answers</span>
      </div>
    </div>

    <div className="space-y-4">
      {filteredQuestions.map(q => (
        <div key={q.id} className="bg-[var(--bg-card)] rounded-2xl shadow-sm border border-[var(--border-card)] overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                <button onClick={() => onLikeQuestion(q.id)} aria-label="Upvote question" className="p-1 hover:bg-jade-50 dark:hover:bg-jade-900/20 rounded-lg transition-colors">
                  <ThumbsUp className={`w-5 h-5 ${q.likes > 0 ? 'text-jade-500' : 'text-[var(--text-tertiary)]'}`} />
                </button>
                <span className="text-sm font-bold text-[var(--text-secondary)]">{q.likes}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {q.solved && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded-md text-[10px] font-bold"><CheckCircle className="w-3 h-3" /> Solved</span>}
                  <span className="px-2 py-0.5 bg-[var(--bg-content)] text-[var(--text-secondary)] rounded-md text-[10px] font-semibold">{q.category}</span>
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-[15px] leading-snug mb-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors" onClick={() => setExpandedQuestionId(expandedQuestionId === q.id ? null : q.id)}>{q.title}</h4>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">{q.body}</p>
                <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                  <span className="font-medium">{q.author}</span>
                  <span>•</span>
                  <span>{q.answers.length} answer{q.answers.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>{getRelativeTime(q.date)}</span>
                </div>
              </div>
            </div>
          </div>

          {expandedQuestionId === q.id && (
            <div className="bg-[var(--bg-content)] border-t border-[var(--border-card)] p-5 space-y-4">
              {q.answers.length > 0 && <h5 className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-2"><MessageCircle className="w-4 h-4" /> {q.answers.length} Answer{q.answers.length !== 1 ? 's' : ''}</h5>}
              {q.answers.map(a => (
                <div key={a.id} className={`flex gap-3 p-4 rounded-xl ${a.accepted ? 'bg-jade-50 dark:bg-jade-950/20 border border-jade-200 dark:border-jade-800' : 'bg-[var(--bg-card)] border border-[var(--border-card)]'}`}>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-content)] overflow-hidden shrink-0">
                    <img src={a.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.author)}&background=random`} className="w-full h-full object-cover" alt={a.author} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-bold text-[var(--text-primary)]">{a.author}</span>
                      {a.isExpert && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded text-[9px] font-bold"><Shield className="w-3 h-3" /> Expert</span>}
                      {a.accepted && <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded text-[9px] font-bold"><CheckCircle className="w-3 h-3" /> Accepted</span>}
                      <span className="text-[10px] text-[var(--text-tertiary)] ml-auto">{getRelativeTime(a.date)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] hover:text-jade-600 font-semibold transition-colors"><ThumbsUp className="w-3 h-3" /> {a.likes}</button>
                      {!q.solved && isSignedIn && q.author === userProfile.name && !a.accepted && (
                        <button onClick={() => onAcceptAnswer(q.id, a.id)} className="flex items-center gap-1 text-[10px] text-jade-600 dark:text-jade-400 hover:underline font-bold"><CheckCircle className="w-3 h-3" /> Accept</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {q.answers.length === 0 && <p className="text-sm text-[var(--text-tertiary)] text-center py-4">No answers yet. Be the first to help!</p>}

              {isSignedIn && (
                <form onSubmit={(e) => { e.preventDefault(); onAnswerSubmit(q.id); }} className="flex gap-2 mt-2">
                  <input value={newAnswer} onChange={e => setNewAnswer(e.target.value)} className="flex-1 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sunburst-500" placeholder="Write your answer..." />
                  <button type="submit" className="bg-amber-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-amber-700 transition-colors shrink-0">Answer</button>
                </form>
              )}
            </div>
          )}
        </div>
      ))}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-3" />
          <p className="text-[var(--text-tertiary)] font-semibold">No questions found</p>
          <p className="text-[var(--text-tertiary)] text-sm">Try a different search or ask a new question</p>
        </div>
      )}
    </div>

    {(qaSearchQuery || qaCategoryFilter !== 'ALL') && questions.length > 0 && (
      <p className="text-center text-[10px] text-[var(--text-tertiary)] mt-2 font-semibold">
        Showing {filteredQuestions.length} of {questions.length} questions
      </p>
    )}
  </div>
);

export default QATab;
