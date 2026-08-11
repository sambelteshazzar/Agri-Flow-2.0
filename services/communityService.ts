import { db } from './persistence';
import { MarketplaceListing, ForumPost, ForumReply, CommunityChatMessage, Story, SocialTrend, SuggestedUser, Question, Answer } from '../types';
import { INITIAL_STORIES, INITIAL_TRENDS, INITIAL_SUGGESTED_USERS } from '../constants';
import { sanitizeText } from '../utils/sanitize';
import { INITIAL_QUESTIONS } from '../components/community/types';

export class CommunityService {
  // --- Marketplace ---
  static async getListings(): Promise<MarketplaceListing[]> {
    const listings = await db.getListings();
    // Sort Active First, then by Date Descending
    return listings.sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  static async addListing(listing: Omit<MarketplaceListing, 'id' | 'verified' | 'status' | 'date'>): Promise<MarketplaceListing[]> {
    // Integrity Check
    if (!listing.item || listing.item.length < 3) throw new Error("Invalid Item Name");
    if (!listing.price) throw new Error("Price is required");

    const current = await db.getListings(); 
    const newListing: MarketplaceListing = {
      ...listing,
      item: sanitizeText(listing.item),
      location: listing.location ? sanitizeText(listing.location) : '',
      contact: sanitizeText(listing.contact),
      id: db.generateId('listing'),
      verified: false,
      status: 'ACTIVE',
      date: new Date().toISOString()
    };
    const updated = [newListing, ...current];
    await db.saveListings(updated);
    return this.getListings(); // Return sorted
  }

  static async replaceAllListings(listings: MarketplaceListing[]): Promise<MarketplaceListing[]> {
    await db.saveListings(listings);
    return listings;
  }

  static async markListingAsSold(id: string): Promise<MarketplaceListing[]> {
    const current = await db.getListings();
    const updated = current.map(l => l.id === id ? { ...l, status: 'SOLD' as const } : l);
    await db.saveListings(updated);
    return this.getListings(); // Return sorted
  }

  // --- Forum ---
  static async getPosts(): Promise<ForumPost[]> {
    const posts = await db.getPosts();
    // Sort by Date Descending
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async getPostReplies(postId: string): Promise<ForumReply[]> {
    return await db.getReplies(postId);
  }

  static async replaceAllPosts(posts: ForumPost[]): Promise<ForumPost[]> {
    await db.savePosts(posts);
    return posts;
  }

  static async addPost(post: Omit<ForumPost, 'id' | 'replies' | 'likes' | 'date'>): Promise<ForumPost[]> {
    if (!post.content) throw new Error("Post content cannot be empty");

    const current = await db.getPosts();
    const newPost: ForumPost = { 
      ...post, 
      content: sanitizeText(post.content),
      title: post.title ? sanitizeText(post.title) : '',
      id: db.generateId('post'),
      replies: 0,
      likes: 0,
      date: new Date().toISOString()
    };
    const updated = [newPost, ...current];
    await db.savePosts(updated);
    return this.getPosts();
  }

  static async deletePost(id: string): Promise<ForumPost[]> {
    const current = await db.getPosts();
    const updated = current.filter(p => p.id !== id);
    await db.savePosts(updated);
    const replies = await db.getReplies(id);
    if (replies.length > 0) {
      const allReplies = await db.getAllReplies();
      await db.saveReplies(allReplies.filter(r => r.postId !== id));
    }
    return this.getPosts();
  }

  static async addReply(postId: string, content: string, author: string): Promise<ForumReply[]> {
    if (!content.trim()) throw new Error("Reply cannot be empty");

    const newReply: ForumReply = {
      id: db.generateId('reply'),
      postId,
      author,
      content: sanitizeText(content),
      date: new Date().toISOString()
    };
    
    // Save reply
    await db.addReply(newReply);
    
    // Increment post reply count transactionally
    const posts = await db.getPosts();
    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, replies: p.replies + 1 } : p
    );
    await db.savePosts(updatedPosts);

    return await db.getReplies(postId);
  }

  static async getLikedPostIds(): Promise<string[]> {
    return await db.getLikedPostIds();
  }

  static async toggleLike(postId: string): Promise<{ posts: ForumPost[], likedIds: string[] }> {
    const posts = await db.getPosts();
    const likedIds = await db.getLikedPostIds();
    const isLiked = likedIds.includes(postId);
    
    let newLikedIds: string[];
    let likeModifier: number;

    if (isLiked) {
      // Unlike
      newLikedIds = likedIds.filter(id => id !== postId);
      likeModifier = -1;
    } else {
      // Like
      newLikedIds = [...likedIds, postId];
      likeModifier = 1;
    }

    const updatedPosts = posts.map(p => 
      p.id === postId ? { ...p, likes: Math.max(0, p.likes + likeModifier) } : p
    );

    await db.savePosts(updatedPosts);
    await db.saveLikedPostIds(newLikedIds);

    // Return sorted posts and updated ids
    return { 
      posts: updatedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
      likedIds: newLikedIds 
    };
  }

  static async getBookmarkedPostIds(): Promise<string[]> {
    return await db.getBookmarkedPostIds();
  }

  static async toggleBookmark(postId: string): Promise<string[]> {
    const bookmarkedIds = await db.getBookmarkedPostIds();
    const isBookmarked = bookmarkedIds.includes(postId);
    const updated = isBookmarked
      ? bookmarkedIds.filter(id => id !== postId)
      : [...bookmarkedIds, postId];
    await db.saveBookmarkedPostIds(updated);
    return updated;
  }

  // --- Chat ---
  static async getChatMessages(channelId?: string): Promise<CommunityChatMessage[]> {
    const allMessages = await db.getChatMessages();
    const sorted = allMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (channelId) {
      return sorted.filter(msg => msg.channelId === channelId);
    }
    return sorted;
  }

  static async replaceAllChatMessages(messages: CommunityChatMessage[]): Promise<CommunityChatMessage[]> {
    await db.saveChatMessages(messages);
    return messages;
  }

  static async sendMessage(message: Omit<CommunityChatMessage, 'id' | 'timestamp'>): Promise<CommunityChatMessage[]> {
    if (!message.text.trim()) throw new Error("Message text required");

    const current = await db.getChatMessages();
    const newMessage: CommunityChatMessage = {
      ...message,
      text: sanitizeText(message.text),
      id: db.generateId('msg'),
      timestamp: new Date().toISOString()
    };
    const updated = [...current, newMessage];
    await db.saveChatMessages(updated);
    return updated;
  }

  // --- Social / Feed Features ---
  static async getStories(): Promise<Story[]> {
    return await db.getStories();
  }

  static async getTrends(): Promise<SocialTrend[]> {
    return await db.getTrends();
  }

  static async getSuggestedUsers(): Promise<SuggestedUser[]> {
    return await db.getSuggestedUsers();
  }

  static async getFollowedUserIds(): Promise<string[]> {
    return await db.getFollowedUserIds();
  }

  static async toggleFollowUser(userId: string): Promise<string[]> {
    const current = await db.getFollowedUserIds();
    const exists = current.includes(userId);
    let updated: string[];
    
    if (exists) {
      updated = current.filter(id => id !== userId);
    } else {
      updated = [...current, userId];
    }
    
    await db.saveFollowedUserIds(updated);
    return updated;
  }

  // --- Q&A ---
  static async getQuestions(): Promise<Question[]> {
    const questions = await db.getQuestions();
    // Sort by Date Descending
    return questions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  static async addQuestion(question: Omit<Question, 'id' | 'answers' | 'likes' | 'solved' | 'date'>): Promise<Question[]> {
    if (!question.title || !question.body) throw new Error("Title and body are required");

    const current = await db.getQuestions();
    const newQuestion: Question = {
      ...question,
      title: sanitizeText(question.title),
      body: sanitizeText(question.body),
      id: db.generateId('question'),
      answers: [],
      likes: 0,
      solved: false,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newQuestion, ...current];
    await db.saveQuestions(updated);
    return this.getQuestions();
  }

  static async addAnswer(questionId: string, answer: Omit<Answer, 'id' | 'likes' | 'accepted' | 'date'>): Promise<Question[]> {
    if (!answer.content.trim()) throw new Error("Answer cannot be empty");

    const questions = await db.getQuestions();
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) throw new Error("Question not found");

    const newAnswer: Answer = {
      ...answer,
      content: sanitizeText(answer.content),
      id: db.generateId('answer'),
      likes: 0,
      accepted: false,
      date: new Date().toISOString().split('T')[0]
    };

    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      answers: [newAnswer, ...updatedQuestions[questionIndex].answers]
    };

    await db.saveQuestions(updatedQuestions);
    return this.getQuestions();
  }

  static async toggleQuestionLike(questionId: string): Promise<{ questions: Question[], likedIds: string[] }> {
    const questions = await db.getQuestions();
    const likedIds = await db.getLikedQuestionIds();
    const isLiked = likedIds.includes(questionId);
    
    let newLikedIds: string[];
    let likeModifier: number;

    if (isLiked) {
      newLikedIds = likedIds.filter(id => id !== questionId);
      likeModifier = -1;
    } else {
      newLikedIds = [...likedIds, questionId];
      likeModifier = 1;
    }

    const updatedQuestions = questions.map(q => 
      q.id === questionId ? { ...q, likes: Math.max(0, q.likes + likeModifier) } : q
    );

    await db.saveQuestions(updatedQuestions);
    await db.saveLikedQuestionIds(newLikedIds);

    return { 
      questions: updatedQuestions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), 
      likedIds: newLikedIds 
    };
  }

  static async toggleAnswerAccepted(questionId: string, answerId: string): Promise<Question[]> {
    const questions = await db.getQuestions();
    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) throw new Error("Question not found");

    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      solved: true,
      answers: updatedQuestions[questionIndex].answers.map(a => 
        a.id === answerId ? { ...a, accepted: true } : { ...a, accepted: false }
      )
    };

    await db.saveQuestions(updatedQuestions);
    return this.getQuestions();
  }

  static async getLikedQuestionIds(): Promise<string[]> {
    return await db.getLikedQuestionIds();
  }
}