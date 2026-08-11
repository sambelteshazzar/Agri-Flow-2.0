import { useState, useCallback, useMemo } from 'react';
import { Question, Answer } from '@/types';
import { useFarm } from '@/contexts/FarmContext';

export function useQA() {
  const { 
    userProfile, isSignedIn, questions, likedQuestionIds,
    addQuestion, addAnswer, toggleQuestionLike, toggleAnswerAccepted,
    showToast, handleAuthRequiredAction
  } = useFarm();

  const [qaSearchQuery, setQaSearchQuery] = useState('');
  const [qaCategoryFilter, setQaCategoryFilter] = useState('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ title: '', body: '', category: 'General' });
  const [newAnswer, setNewAnswer] = useState('');
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const QA_CATEGORIES = [
    { key: 'ALL', label: 'All' },
    { key: 'Crops', label: 'Crops' },
    { key: 'Pests', label: 'Pests' },
    { key: 'Livestock', label: 'Livestock' },
    { key: 'Equipment', label: 'Equipment' },
    { key: 'Soil', label: 'Soil & Fertilizer' },
    { key: 'Market', label: 'Market & Prices' },
  ];

  const filteredQuestions = useMemo(() => {
    let result = questions;
    if (qaCategoryFilter !== 'ALL') {
      result = result.filter(q => q.category === qaCategoryFilter);
    }
    if (qaSearchQuery) {
      const q = qaSearchQuery.toLowerCase();
      result = result.filter(quest => 
        quest.title.toLowerCase().includes(q) || 
        quest.body.toLowerCase().includes(q) || 
        quest.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [questions, qaSearchQuery, qaCategoryFilter]);

  const getRelativeTime = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  }, []);

  const handleQuestionSubmit = async () => {
    if (!newQuestion.title.trim()) return;
    await addQuestion({
      title: newQuestion.title,
      body: newQuestion.body,
      category: newQuestion.category,
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
    });
    setNewQuestion({ title: '', body: '', category: 'General' });
    setIsQuestionModalOpen(false);
  };

  const handleAnswerSubmit = async (questionId: string) => {
    if (!newAnswer.trim()) return;
    await addAnswer(questionId, {
      author: userProfile.name,
      authorAvatar: userProfile.avatar,
      content: newAnswer,
      isExpert: false,
    });
    setNewAnswer('');
  };

  const handleLikeQuestion = async (questionId: string) => {
    await toggleQuestionLike(questionId);
  };

  const handleAcceptAnswer = async (questionId: string, answerId: string) => {
    await toggleAnswerAccepted(questionId, answerId);
  };

  return {
    // State
    qaSearchQuery,
    setQaSearchQuery,
    qaCategoryFilter,
    setQaCategoryFilter,
    expandedQuestionId,
    setExpandedQuestionId,
    newQuestion,
    setNewQuestion,
    newAnswer,
    setNewAnswer,
    isQuestionModalOpen,
    setIsQuestionModalOpen,
    filteredQuestions,
    QA_CATEGORIES,
    // Actions
    getRelativeTime,
    handleQuestionSubmit,
    handleAnswerSubmit,
    handleLikeQuestion,
    handleAcceptAnswer,
  };
}