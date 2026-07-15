import React, { useState, useMemo } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { GraduationCap, PlayCircle, Check, Clock, BookOpen, User, Star, Search, ArrowLeft, Play, FileText, Lock, Award, Pause, CheckCircle2 } from 'lucide-react';

const EducationHub: React.FC = () => {
  const { learningModules, completeModule, updateModuleProgress } = useFarm();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const categories = ['All', 'Regenerative', 'Economics', 'Tech', 'Resilience'];

  const filteredModules = learningModules.filter(m => {
    const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeCourse = useMemo(() => 
    learningModules.find(m => m.id === activeCourseId), 
  [activeCourseId, learningModules]);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'text-jade-600 bg-jade-100 dark:bg-jade-900/30 dark:text-jade-400';
      case 'Intermediate': return 'text-sunburst-600 bg-sunburst-100 dark:bg-sunburst-900/30 dark:text-sunburst-400';
      case 'Advanced': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      default: return 'text-terra-600 bg-terra-100 dark:bg-terra-800 dark:text-terra-300';
    }
  };

  const handleStartCourse = (id: string) => {
    const mod = learningModules.find(m => m.id === id);
    setActiveCourseId(id);
    setCurrentLessonIdx(mod?.completed ? (mod.lessonsCount - 1) : (mod.completedLessons.length > 0 ? Math.max(...mod.completedLessons) + 1 : 0));
    setIsPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteCourse = () => {
    if (activeCourseId) {
      completeModule(activeCourseId);
    }
  };

  const handleLessonComplete = (idx: number) => {
    if (activeCourseId) {
      updateModuleProgress(activeCourseId, Math.round(((idx + 1) / activeCourse.lessonsCount) * 100), idx);
    }
  };

  const handleLessonChange = (idx: number) => {
    setCurrentLessonIdx(idx);
    setIsPlaying(false);
  };

  const getLessonTitle = (index: number, total: number, category: string) => {
    if (index === 0) return "Introduction & Core Principles";
    if (index === total - 1) return "Final Assessment & Certification";
    
    const topics: Record<string, string[]> = {
      'Regenerative': ['Soil Microbiology', 'Cover Crop Termination', 'No-Till Drills', 'Compost Tea Application', 'Carbon Sequestration Metrics'],
      'Economics': ['Hedging Strategies', 'Input Cost Analysis', 'Market Volatility', 'Cooperative Buying', 'Grant Writing'],
      'Tech': ['Drone Flight Paths', 'NDVI Data Interpretation', 'Sensor Calibration', 'Automated Irrigation', 'Data Security'],
      'Resilience': ['Water Retention Landscapes', 'Drought-Resistant Breeds', 'IPM Implementation', 'Diversification', 'Emergency Protocols']
    };

    const specificTopics = topics[category] || ['Core Concept', 'Advanced Application', 'Case Studies', 'Field Implementation', 'Review'];
    return `Module ${index}: ${specificTopics[(index - 1) % specificTopics.length]}`;
  };

  if (activeCourse) {
    const lessons = Array.from({ length: activeCourse.lessonsCount }).map((_, i) => ({
      id: i,
      title: getLessonTitle(i, activeCourse.lessonsCount, activeCourse.category),
      duration: `${15 + (i % 5) * 3}:00`,
      isLocked: i > currentLessonIdx && !activeCourse.completedLessons.includes(i),
      isCompleted: activeCourse.completedLessons.includes(i)
    }));

    const videoId = activeCourse.videoId;

    return (
      <div className="h-full flex flex-col animate-fade-in pb-10">
        <div className="flex items-center gap-4 mb-6 organic-divider pb-4">
           <button 
              onClick={() => setActiveCourseId(null)}
              aria-label="Go back to course list"
              className="p-2 hover:bg-terra-100 dark:hover:bg-jade-800 rounded-full transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 text-secondary-dynamic group-hover:text-primary-dynamic" aria-hidden="true" />
           </button>
           <div>
             <div className="flex items-center gap-2 mb-1">
               <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getDifficultyColor(activeCourse.difficulty)}`}>
                 {activeCourse.difficulty}
               </span>
               <span className="text-jade-400 text-xs font-semibold">• {activeCourse.category}</span>
             </div>
             <h1 className="text-2xl font-bold text-primary-dynamic leading-none">{activeCourse.title}</h1>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group shadow-2xl">
                 {isPlaying ? (
                   <iframe 
                     className="w-full h-full"
                     src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                     title="Course Video"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                   ></iframe>
                 ) : (
                   <>
                     <img 
                       src={activeCourse.thumbnail} 
                       className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" 
                       alt="Video cover" 
                    onError={(e) => {
                      e.currentTarget.src = '/stock/crop-default.svg';
                    }}
                  />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <button 
                           onClick={() => setIsPlaying(true)}
                           aria-label="Play course video"
                           className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer border-2 border-white/50"
                        >
                           <Play className="w-8 h-8 text-white fill-white ml-1" aria-hidden="true" />
                        </button>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-4">
                           <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                              <div className="h-full w-0 bg-sunburst-500"></div>
                           </div>
                           <span className="text-xs font-bold text-white font-mono">{lessons[currentLessonIdx].duration}</span>
                        </div>
                     </div>
                   </>
                 )}
              </div>

              <div className="card-surface p-6 rounded-2xl">
                 <h3 className="text-lg font-bold text-primary-dynamic mb-3">{lessons[currentLessonIdx].title}</h3>
                 <p className="text-secondary-dynamic leading-relaxed mb-6">
                    In this lesson, we break down critical strategies for {activeCourse.category.toLowerCase()} success. 
                    {activeCourse.description} We focus on practical application in the field to minimize risk and maximize long-term yield stability.
                 </p>
                 
                 <div className="flex items-center justify-between pt-6 organic-divider">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-terra-200 dark:bg-jade-700 rounded-full flex items-center justify-center text-jade-500">
                          <User className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-primary-dynamic">{activeCourse.instructor}</p>
                          <p className="text-xs text-jade-500 font-medium">Lead Agronomist</p>
                       </div>
                    </div>
                    {activeCourse.completed ? (
                       <div className="flex items-center gap-2 px-4 py-2 bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-400 rounded-xl font-bold text-sm">
                          <Award className="w-5 h-5" /> Certificate Earned
                       </div>
                    ) : (
                       <button 
                         onClick={handleCompleteCourse}
                         className="px-6 py-3 bg-jade-800 dark:bg-sunburst-500 text-white dark:text-jade-900 rounded-xl font-semibold text-xs hover:bg-jade-700 dark:hover:bg-sunburst-400 transition-colors shadow-lg"
                       >
                          Mark Complete
                       </button>
                    )}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-1">
              <div className="card-surface rounded-2xl overflow-hidden h-full max-h-[calc(100vh-12rem)] flex flex-col">
                 <div className="p-5 border-b border-primary-dynamic bg-terra-50 dark:bg-jade-800/50">
                    <h3 className="font-semibold text-primary-dynamic text-sm">Course Syllabus</h3>
                    <div className="mt-2 flex items-center gap-2 text-xs text-jade-500">
                       <BookOpen className="w-4 h-4" />
                       <span>{activeCourse.lessonsCount} Lessons</span>
                       <span>•</span>
                       <Clock className="w-4 h-4" />
                       <span>{activeCourse.duration} Total</span>
                    </div>
                 </div>
                 
<div className="flex-1 overflow-y-auto custom-scrollbar">
                     {lessons.map((lesson, idx) => (
                        <button 
                          key={lesson.id}
                          onClick={() => !lesson.isLocked && handleLessonChange(idx)}
                          disabled={lesson.isLocked}
                          className={`w-full text-left p-4 border-b border-primary-dynamic transition-colors flex items-start gap-3 hover:bg-terra-50 dark:hover:bg-jade-800/50 ${currentLessonIdx === idx ? 'bg-jade-50 dark:bg-jade-900/20 border-l-4 border-l-jade-500' : 'border-l-4 border-l-transparent'}`}
                        >
                           <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${currentLessonIdx === idx ? 'bg-jade-500 border-jade-500 text-white' : lesson.isCompleted ? 'bg-jade-500 border-jade-500 text-white' : lesson.isLocked ? 'border-terra-300 dark:border-jade-600 text-terra-300 dark:text-jade-500' : 'border-jade-500 text-jade-500'}`}>
                              {lesson.isCompleted ? <CheckCircle2 className="w-3 h-3 fill-current" /> : (currentLessonIdx === idx ? (isPlaying ? <Pause className="w-3 h-3 fill-current"/> : <Play className="w-3 h-3 fill-current" />) : <Lock className="w-3 h-3" />)}
                           </div>
                           <div className="flex-1">
                              <p className={`text-sm font-bold ${currentLessonIdx === idx ? 'text-jade-700 dark:text-jade-400' : lesson.isCompleted ? 'text-jade-600 dark:text-jade-400' : lesson.isLocked ? 'text-jade-400 dark:text-jade-500' : 'text-secondary-dynamic'}`}>
                                 {lesson.title}
                              </p>
                              <span className="text-[10px] font-mono text-jade-400 dark:text-jade-500 mt-1 block">{lesson.duration}</span>
                           </div>
                           {!lesson.isLocked && !lesson.isCompleted && (
                             <button 
                               onClick={(e) => { e.stopPropagation(); handleLessonComplete(idx); }}
                               className="px-3 py-1 text-xs font-semibold bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded hover:bg-jade-200 dark:hover:bg-jade-800/50 transition-colors"
                             >
                               Mark Complete
                             </button>
                           )}
                           {lesson.isCompleted && (
                             <span className="px-3 py-1 text-xs font-semibold bg-jade-100 dark:bg-jade-900/30 text-jade-700 dark:text-jade-300 rounded">Done</span>
                           )}
                        </button>
                     ))}
                  </div>
                 
                 <div className="p-4 bg-terra-50 dark:bg-jade-900 border-t border-primary-dynamic">
                    <div className="flex justify-between text-xs font-bold text-jade-500 mb-2">
                       <span>Progress</span>
                       <span>{activeCourse.completed ? '100%' : `${Math.round((currentLessonIdx / activeCourse.lessonsCount) * 100)}%`}</span>
                    </div>
                    <div className="h-2 bg-terra-200 dark:bg-jade-700 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-jade-500 transition-all duration-500"
                         style={{ width: activeCourse.completed ? '100%' : `${(currentLessonIdx / activeCourse.lessonsCount) * 100}%` }}
                       ></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-10">
      
      <div className="relative bg-jade-800 dark:bg-jade-950 rounded-3xl p-8 overflow-hidden shadow-2xl flex-shrink-0">
         <div className="absolute inset-0 opacity-60 bg-jade-700 bg-cover bg-center"></div>
         <div className="absolute inset-0 bg-gradient-to-r from-jade-800 dark:from-jade-950 via-jade-900/80 to-transparent"></div>
         <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
               <span className="px-3 py-1 rounded-full bg-sunburst-500 text-jade-900 text-xs font-semibold">Premium Certification</span>
               <div className="flex text-sunburst-500"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white font-heading mb-4 leading-tight">
               Master Regenerative <br/> Agriculture
            </h1>
            <p className="text-jade-300 text-lg mb-8 font-medium leading-relaxed max-w-lg">
               Learn regenerative agriculture from leading experts. Courses designed for West African conditions.
            </p>
             <button onClick={() => document.getElementById('course-catalog')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-jade-900 px-8 py-3 rounded-full font-semibold hover:bg-sunburst-100 transition-colors shadow-lg flex items-center gap-2">
               Explore Courses <BookOpen className="w-4 h-4" />
            </button>
         </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
         <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setFilterCategory(cat)}
                 className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${filterCategory === cat ? 'bg-jade-800 dark:bg-sunburst-100 text-white dark:text-jade-900 border-jade-800 dark:border-sunburst-200' : 'bg-card-dynamic text-secondary-dynamic border-primary-dynamic hover:border-jade-400 dark:hover:border-jade-500'}`}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-jade-400" />
            <input type="text" placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-card-dynamic border border-primary-dynamic rounded-full text-sm font-medium focus:outline-none focus:border-jade-400 dark:focus:border-jade-500 text-primary-dynamic" />
         </div>
      </div>

       <div id="course-catalog" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredModules.map(module => (
            <div key={module.id} className="card-surface rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={() => handleStartCourse(module.id)}>
               <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-3 left-3 z-10 flex gap-2">
                     <span className={`px-2 py-1 rounded text-[10px] font-semibold shadow-sm ${getDifficultyColor(module.difficulty)}`}>{module.difficulty}</span>
                  </div>
                  <img 
                    src={module.thumbnail} 
                    alt={module.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   onError={(e) => {
                     e.currentTarget.src = '/stock/crop-default.svg';
                   }}
                  />
                  {module.completed && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="bg-jade-500 text-white px-4 py-2 rounded-full font-semibold text-xs flex items-center shadow-lg">
                           <Check className="w-4 h-4 mr-2" /> Completed
                        </div>
                     </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                     <div className="flex items-center text-white text-xs font-bold gap-3">
                        <span className="flex items-center"><BookOpen className="w-3 h-3 mr-1 opacity-80"/> {module.lessonsCount} Lessons</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-1 opacity-80"/> {module.duration}</span>
                     </div>
                  </div>
               </div>
               <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-primary-dynamic text-lg leading-tight mb-2 group-hover:text-jade-600 dark:group-hover:text-jade-400 transition-colors">{module.title}</h3>
                  <p className="text-secondary-dynamic text-sm line-clamp-2 mb-4">{module.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 organic-divider">
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-terra-200 dark:bg-jade-700 flex items-center justify-center text-jade-500 dark:text-jade-400 text-[10px] font-bold">
                           <User className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-secondary-dynamic">{module.instructor}</span>
                     </div>
                     <PlayCircle className="w-8 h-8 text-terra-300 dark:text-jade-600 group-hover:text-sunburst-500 transition-colors" />
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default EducationHub;
