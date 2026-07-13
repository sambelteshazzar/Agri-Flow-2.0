import React, { useEffect, useState } from 'react';
import { getStockImage } from '@/utils/stockImages';
import { fetchNewsImage, isPixabayConfigured } from '@/utils/newsImages';
import { useFarm } from '../contexts/FarmContext';
import { Newspaper, Loader2, ExternalLink, Clock, RefreshCw, Zap, TrendingUp, Leaf, Landmark, Signal, Search } from 'lucide-react';
import { isAIConfigured } from '../services/geminiService';

const AG_NEWS_SOURCES: Record<string, string> = {
  Market: 'https://www.reuters.com/business/agriculture/',
  Tech: 'https://www.agweb.com/news/technology',
  Climate: 'https://www.fao.org/climate-change/en/',
  Policy: 'https://www.agri-pulse.com/',
};

const NewsHub: React.FC = () => {
  const { newsArticles, refreshNews, isLoadingNews, showToast } = useFarm();
  // Pixabay-fetched cover photos keyed by article.id. Populated asynchronously
  // after articles load; missing keys fall back to category SVG placeholders.
  const [photoMap, setPhotoMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (newsArticles.length === 0) {
      refreshNews();
    }
  }, [refreshNews, newsArticles.length]);

  useEffect(() => {
    if (!isPixabayConfigured() || newsArticles.length === 0) return;
    const controller = new AbortController();
    const missing = newsArticles.filter(a => !a.imageUrl && !photoMap[a.id]);
    if (missing.length === 0) return;

    (async () => {
      const entries = await Promise.all(
        missing.map(async a => {
          const url = await fetchNewsImage(a, {
            preferLarge: a.id === newsArticles[0]?.id,
            signal: controller.signal,
          });
          return [a.id, url] as const;
        }),
      );
      if (controller.signal.aborted) return;
      const next: Record<string, string> = { ...photoMap };
      for (const [id, url] of entries) {
        if (url) next[id] = url;
      }
      setPhotoMap(next);
    })();

    return () => controller.abort();
  }, [newsArticles, photoMap]);

  const handleNewsClick = (e: React.MouseEvent, url?: string, category?: string) => {
    if (!url || url === '#' || url.trim() === '') {
      e.preventDefault();
      const fallback = category && AG_NEWS_SOURCES[category] ? AG_NEWS_SOURCES[category] : 'https://www.reuters.com/business/agriculture/';
      window.open(fallback, '_blank', 'noopener,noreferrer');
      showToast('Opening source feed — individual article not yet linked.', 'info');
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Tech': return <Zap className="w-3 h-3" />;
      case 'Market': return <TrendingUp className="w-3 h-3" />;
      case 'Climate': return <Leaf className="w-3 h-3" />;
      case 'Policy': return <Landmark className="w-3 h-3" />;
      default: return <Newspaper className="w-3 h-3" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tech': return 'bg-sunburst-100 text-sunburst-700 border-sunburst-200 dark:bg-sunburst-900/30 dark:text-sunburst-300 dark:border-sunburst-800';
      case 'Market': return 'bg-jade-100 text-jade-700 border-jade-200 dark:bg-jade-900/30 dark:text-jade-300 dark:border-jade-800';
      case 'Climate': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'Policy': return 'bg-terra-200 text-terra-800 border-terra-300 dark:bg-terra-800/40 dark:text-terra-200 dark:border-terra-700';
      default: return 'bg-terra-100 text-terra-700 border-terra-200 dark:bg-jade-800 dark:text-jade-300 dark:border-jade-700';
    }
  };

  const getDeterministicImage = (cat: string) => {
    switch (cat) {
      case 'Tech': return getStockImage('techNews');
      case 'Market': return getStockImage('marketNews');
      case 'Climate': return getStockImage('climateNews');
      case 'Policy': return getStockImage('policyNews');
      default: return getStockImage('news');
    }
  };

  // Resolve the actual <img src> for an article: prefer Pixabay photo, then
  // an AI-supplied imageUrl (future), then the category SVG placeholder.
  const resolveCover = (article: { id: string; category: string; imageUrl?: string }): string => {
    return photoMap[article.id] || article.imageUrl || getDeterministicImage(article.category);
  };

  const featuredArticle = newsArticles[0];
  const remainingArticles = newsArticles.slice(1);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end organic-divider pb-4 transition-colors">
        <div>
          <h2 className="text-3xl font-bold text-primary-dynamic font-heading flex items-center">
            AgriFlow News <span className="ml-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
          </h2>
          <p className="text-secondary-dynamic font-semibold text-xs mt-1 flex items-center">
            <Signal className="w-3 h-3 mr-1" /> {isAIConfigured() ? 'Live Agricultural Feed' : 'Sample Agricultural Feed'}
            {!isAIConfigured() && <span className="ml-1.5 px-1 py-0.5 bg-terra-200 dark:bg-terra-800 text-terra-700 dark:text-terra-300 text-[8px] font-bold rounded uppercase tracking-wide">Simulated</span>}
          </p>
        </div>
        <button 
          onClick={refreshNews}
          disabled={isLoadingNews}
          className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-jade-800 dark:bg-sunburst-100 border border-jade-800 dark:border-sunburst-200 text-white dark:text-jade-900 rounded hover:opacity-90 transition-opacity text-xs font-semibold shadow-sm disabled:opacity-50 active:scale-95"
        >
          {isLoadingNews ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          {isLoadingNews ? 'Syncing...' : 'Refresh Feed'}
        </button>
      </div>

      {isLoadingNews && newsArticles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-jade-400 bg-terra-50 dark:bg-jade-900/50 rounded-2xl border border-primary-dynamic">
           <div className="relative">
             <div className="absolute inset-0 bg-jade-500/20 rounded-full animate-ping"></div>
             <Loader2 className="w-12 h-12 mb-4 animate-spin text-jade-600 dark:text-jade-400 relative z-10" />
           </div>
           <p className="text-sm font-semibold text-secondary-dynamic">Pulling latest stories...</p>
           <p className="text-[10px] text-jade-500 mt-2">Aggregating global agricultural news</p>
        </div>
      ) : newsArticles.length > 0 ? (
        <>
          {featuredArticle && (
            <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border border-jade-900/20 dark:border-jade-700/30">
                <img 
                  src={resolveCover(featuredArticle)} 
                  alt={featuredArticle.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = '/stock/news.svg';
                  }}
                />
               <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full max-w-4xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] font-semibold ${getCategoryColor(featuredArticle.category)} bg-white/90 text-terra-900 border-white/20 backdrop-blur-md shadow-lg`}>
                       {getCategoryIcon(featuredArticle.category)} {featuredArticle.category}
                    </div>
                    <span className="text-[10px] font-semibold text-jade-300 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">Featured</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-black text-white font-heading leading-tight mb-4 drop-shadow-xl">
                    {featuredArticle.title}
                  </h3>
                  
                  <p className="text-jade-200 text-sm md:text-lg font-medium leading-relaxed mb-8 line-clamp-2 max-w-3xl drop-shadow-md">
                    {featuredArticle.summary}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs font-semibold text-jade-400 border-t border-white/10 pt-4">
                     <span className="text-white flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                       {featuredArticle.source}
                     </span>
                     <span>•</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {featuredArticle.timeAgo}</span>
                     
                     <a 
                       href={featuredArticle.url || '#'} 
                        onClick={(e) => handleNewsClick(e, featuredArticle.url, featuredArticle.category)}
                       target="_blank" 
                       rel="noreferrer" 
                       className="ml-auto flex items-center gap-2 px-4 py-2 bg-sunburst-500 text-jade-900 rounded-lg hover:bg-sunburst-400 transition-all shadow-lg active:scale-95"
                     >
                       Read Full Story <ExternalLink className="w-3 h-3" />
                     </a>
                  </div>
               </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {remainingArticles.map(article => (
               <div key={article.id} className="card-surface rounded-xl overflow-hidden flex flex-col group hover:-translate-y-1">
                  <div className="h-44 overflow-hidden relative">
                      <img 
                        src={resolveCover(article)} 
                        alt={article.title} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/stock/news.svg';
                        }}
                      />
                     <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold border shadow-sm ${getCategoryColor(article.category)} bg-white/95 dark:bg-jade-900/90 backdrop-blur-sm`}>
                           {getCategoryIcon(article.category)} {article.category}
                        </span>
                     </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                     <div className="mb-4">
                        <h4 className="font-bold text-primary-dynamic text-lg leading-tight mb-2 group-hover:text-jade-600 dark:group-hover:text-jade-400 transition-colors line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-secondary-dynamic text-xs leading-relaxed line-clamp-3 font-medium">
                          {article.summary}
                        </p>
                     </div>
                     
                     <div className="mt-auto pt-4 organic-divider flex justify-between items-center text-[10px] font-semibold text-jade-500 dark:text-jade-400">
                        <span className="truncate max-w-[100px] text-secondary-dynamic">{article.source}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.timeAgo}</span>
                     </div>
                     
                     <a 
                       href={article.url || '#'} 
                        onClick={(e) => handleNewsClick(e, article.url, article.category)}
                       target="_blank" 
                       rel="noreferrer" 
                       className="mt-3 block w-full text-center py-2.5 bg-terra-50 dark:bg-jade-800 hover:bg-terra-100 dark:hover:bg-jade-700 text-secondary-dynamic text-xs font-semibold rounded-lg border border-primary-dynamic transition-colors"
                     >
                        Read Source
                     </a>
                  </div>
               </div>
             ))}
          </div>
        </>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-primary-dynamic rounded-2xl bg-terra-50 dark:bg-jade-900/30">
           <div className="w-16 h-16 bg-terra-200 dark:bg-jade-800 rounded-full flex items-center justify-center mx-auto mb-4">
             <Newspaper className="w-8 h-8 text-jade-400" />
           </div>
           <h3 className="text-primary-dynamic font-bold text-lg mb-2">No News Available</h3>
           <p className="text-secondary-dynamic text-sm mb-6 max-w-xs mx-auto">We couldn't fetch the latest headlines. Please check your internet connection and try again.</p>
           <button 
             onClick={refreshNews} 
             className="px-6 py-3 bg-jade-600 hover:bg-jade-500 text-white rounded-lg font-semibold text-xs shadow-md transition-all active:scale-95"
           >
             Retry Connection
           </button>
        </div>
      )}
    </div>
  );
};

export default NewsHub;
