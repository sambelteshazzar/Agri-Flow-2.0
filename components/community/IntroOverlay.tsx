import React from 'react';
import { Globe, ShoppingBag, HelpCircle, Zap, ArrowRight } from 'lucide-react';

interface IntroOverlayProps {
  showIntro: boolean;
  onDismiss: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ showIntro, onDismiss }) => (
  <div className={`absolute inset-0 z-intro-overlay bg-jade-950 flex flex-col items-center justify-center text-center p-6 transition-opacity duration-700 ${!showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
    
    <div className="absolute inset-0 opacity-40">
      <div className="w-full h-full bg-gradient-to-br from-jade-800/40 via-jade-900 to-jade-950"></div>
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/80 to-transparent"></div>
    
    <div className="relative z-10 max-w-3xl animate-fade-in-up">
      <div className="flex justify-center mb-6">
         <div className="bg-jade-500/20 p-4 rounded-full backdrop-blur-md border border-jade-500/30">
             <Globe className="w-12 h-12 text-jade-400" />
         </div>
      </div>
      <h1 className="text-6xl md:text-8xl font-black text-white mb-6 font-heading">
         Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-jade-400 to-sunburst-400">Flow</span>
      </h1>
      <p className="text-lg md:text-xl text-jade-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
        Connect with thousands of growers, trade equipment in the marketplace, and share real-time insights to build a more resilient future.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
         <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
             <ShoppingBag className="w-8 h-8 text-sunburst-400 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Marketplace</h3>
            <p className="text-jade-400 text-sm">Buy, sell, and trade equipment and harvest directly.</p>
         </div>
         <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <HelpCircle className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Q&A Hub</h3>
            <p className="text-jade-400 text-sm">Ask questions, get expert answers, and share your knowledge.</p>
         </div>
         <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
             <Zap className="w-8 h-8 text-jade-400 mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Live Intel</h3>
            <p className="text-jade-400 text-sm">Real-time alerts on prices, pests, and weather.</p>
         </div>
      </div>

      <button 
        onClick={onDismiss}
        className="group relative px-10 py-4 bg-sunburst-50 text-jade-950 font-semibold rounded-full hover:bg-sunburst-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(34,197,94,0.4)] flex items-center gap-3 mx-auto"
      >
        Enter Community
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

export default IntroOverlay;
