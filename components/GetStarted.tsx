
import React, { useRef, useState } from 'react';
import { Sprout, BrainCircuit, ChevronRight, BarChart3, Globe, Zap, CloudLightning, ArrowUpRight, ArrowDownRight, Users, Leaf, GraduationCap, HardHat, Calculator, MessageSquare, Database, Code, Layers, Shield, Cpu } from 'lucide-react';
import { useFarm } from '../contexts/FarmContext';

interface GetStartedProps {
  onStart: () => void;
}

const GetStarted: React.FC<GetStartedProps> = ({ onStart }) => {
  const { showToast } = useFarm();
  const featuresRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const architectureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // This is the scrollable viewport
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePlaceholderLink = (e: React.MouseEvent, name: string) => {
    e.preventDefault();
    const urls: Record<string, string> = {
      'Privacy': 'agriflow.ai/privacy',
      'Terms': 'agriflow.ai/terms',
      'API Docs': 'agriflow.ai/docs',
      'Support': 'agriflow.ai/support',
    };
    showToast(`${name} available at ${urls[name] || 'agriflow.ai'}`, 'info');
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="h-screen w-full bg-jade-950 text-white font-sans selection:bg-green-500 selection:text-white overflow-y-auto overflow-x-hidden relative scroll-smooth"
    >
      
      {/* --- CINEMATIC BACKGROUND LAYER (Fixed relative to viewport) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Primary Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 animate-slow-zoom"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=2674&auto=format&fit=crop")' }}
        ></div>
        
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-jade-950/95 via-jade-900/80 to-jade-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jade-900/50 to-jade-950"></div>

        {/* Interactive Glow */}
        <div 
          className="absolute inset-0 bg-[radial-gradient(800px_circle_at_var(--x)_var(--y),rgba(34,197,94,0.06),transparent_50%)] z-10"
          style={{ 
            '--x': `${mousePosition.x}px`, 
            '--y': `${mousePosition.y}px` 
          } as React.CSSProperties}
        ></div>
      </div>

      {/* --- NAVIGATION (Sticky) --- */}
      <nav className="sticky top-0 z-50 w-full p-6 flex justify-between items-center border-b border-white/5 bg-jade-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
           <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-10 h-10 rounded-lg shadow-lg shadow-jade-500/20" />
           <div className="flex flex-col">
             <span className="text-xl font-bold tracking-tight font-heading leading-none">Agri<span className="text-jade-400">Flow</span></span>
           </div>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-jade-300">
           <button onClick={() => scrollToSection(featuresRef)} className="hover:text-white cursor-pointer transition-colors">Features</button>
           <button onClick={() => scrollToSection(architectureRef)} className="hover:text-white cursor-pointer transition-colors">How it works</button>
           <button onClick={() => scrollToSection(aboutRef)} className="hover:text-white cursor-pointer transition-colors">About</button>
            <div className="w-px h-4 bg-jade-700"></div>
             <button 
               onClick={onStart} 
               className="px-5 py-2 bg-white text-jade-950 rounded-full font-bold hover:bg-green-400 hover:text-jade-950 transition-all shadow-lg"
             >
               Sign in
             </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 flex flex-col justify-center items-start px-4 max-w-7xl mx-auto w-full pt-32 pb-48">
        
        <div className="max-w-4xl">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-xs font-semibold mb-8 animate-fade-in-up backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <Zap className="w-3 h-3 text-green-400" />
            Now with Smart AI — Your farming companion
          </div>
          
           {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl font-black font-heading tracking-tight leading-[0.9] text-white mb-8 animate-fade-in-up drop-shadow-2xl">
              Smart Farming Solutions for West African Farmers
            </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-jade-300 max-w-2xl font-medium leading-relaxed mb-12 animate-fade-in-up border-l-4 border-green-500 pl-6">
            Your complete farming companion — from planting to harvest, with smart AI by your side.
          </p>

           {/* CTA Buttons */}
           <div className="flex flex-col md:flex-row gap-5 items-center animate-fade-in-up">
              <button 
                onClick={() => {
                  console.log('GetStarted button clicked');
                  onStart();
                }}
                className="group px-10 py-5 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-full transition-all shadow-[0_0_30px_rgba(22,163,74,0.3)] hover:shadow-[0_0_50px_rgba(22,163,74,0.5)] flex items-center gap-3 w-full md:w-auto justify-center"
              >
                Sign in
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            <button 
              onClick={() => scrollToSection(featuresRef)}
              className="px-10 py-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold text-lg rounded-full transition-all w-full md:w-auto"
            >
              Explore features
            </button>
          </div>
        </div>

      </div>

      {/* --- LIVE TICKER --- */}
      <div className="relative z-20 bg-jade-950/80 border-y border-jade-800 py-4 backdrop-blur-md overflow-hidden">
         <div className="flex animate-marquee whitespace-nowrap gap-24 max-w-7xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <React.Fragment key={i}>
                  <div className="flex items-center gap-4 text-sm font-semibold text-jade-500">
                   <Globe className="w-4 h-4 text-blue-500"/>
                   <span className="text-jade-200">Live market data</span>
                </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-jade-500">
                   <span className="text-white font-semibold">Maize</span>
                   <span className="text-green-400">₦28,500 (+8.2%)</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-jade-500">
                   <span className="text-white font-semibold">Cowpea</span>
                   <span className="text-red-400">₦35,000 (-3.5%)</span>
                 </div>
                 <div className="flex items-center gap-2 text-sm font-medium text-jade-500">
                   <span className="text-white font-semibold">Millet</span>
                   <span className="text-green-400">₦20,000 (+12.0%)</span>
                 </div>
                 <div className="flex items-center gap-4 text-sm font-semibold text-jade-500">
                   <CloudLightning className="w-4 h-4 text-yellow-500"/>
                   <span className="text-jade-200">Weather updates live</span>
                </div>
              </React.Fragment>
            ))}
         </div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div ref={featuresRef} className="relative z-10 w-full bg-jade-950 border-t border-jade-800">
        <div className="max-w-7xl mx-auto px-6 py-32">
          
          <div className="mb-20">
              <span className="text-green-500 font-semibold text-sm mb-2 block">What you get</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">
                Everything your farm needs
              </h2>
              <p className="text-jade-400 text-xl leading-relaxed max-w-3xl">
                AgriFlow brings all your farm data into one clear, easy-to-use interface. No more jumping between spreadsheets and apps.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cards */}
            {[
              { icon: Database, color: 'text-green-400', bg: 'bg-green-500/10', title: 'My Crops', desc: 'Track every field, monitor soil health, and watch your crops grow stage by stage.' },
              { icon: Users, color: 'text-yellow-400', bg: 'bg-yellow-500/10', title: 'Community', desc: 'Connect with fellow farmers, share tips, and browse the marketplace.' },
              { icon: BrainCircuit, color: 'text-purple-400', bg: 'bg-purple-500/10', title: 'AI Advisor', desc: 'Get personalized agronomy advice and smart diagnostics, powered by AI.' },
              { icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10', title: 'Market', desc: 'Track prices, forecast revenue, and optimize your input costs.' },
              { icon: GraduationCap, color: 'text-pink-400', bg: 'bg-pink-500/10', title: 'Learn', desc: 'Professional courses on regenerative farming and sustainable practices.' },
              { icon: HardHat, color: 'text-red-400', bg: 'bg-red-500/10', title: 'Labor Planner', desc: 'Calculate the right workforce size for your farm and season.' },
              { icon: Calculator, color: 'text-teal-400', bg: 'bg-teal-500/10', title: 'Calculators', desc: 'Quick tools for irrigation, fertilizer, and planting calculations.' },
              { icon: Globe, color: 'text-orange-400', bg: 'bg-orange-500/10', title: 'News', desc: 'Stay informed on climate trends, trade policies, and market shifts.' },
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-jade-900 border border-jade-800 hover:border-jade-600 hover:bg-jade-800/50 transition-all group">
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-jade-400 leading-relaxed text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ARCHITECTURE SECTION --- */}
      <div ref={architectureRef} className="relative z-10 w-full bg-jade-900 border-t border-jade-800 py-32">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                     <Cpu className="w-3 h-3" /> How it works
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-heading">Works where you work</h2>
                   <p className="text-jade-400 text-lg mb-8 leading-relaxed">
                     AgriFlow runs right in your browser — even with spotty rural internet. When you're back online, everything syncs seamlessly so you never lose your data.
                  </p>
                 
                 <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-jade-800 flex items-center justify-center shrink-0 border border-jade-700">
                           <Code className="w-6 h-6 text-sky-400" />
                        </div>
                         <div>
                            <h4 className="text-white font-bold text-lg">Fast & responsive</h4>
                            <p className="text-jade-500 text-sm">Built with React and TailwindCSS for a smooth, snappy experience on any device — phone, tablet, or desktop.</p>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="w-12 h-12 rounded-xl bg-jade-800 flex items-center justify-center shrink-0 border border-jade-700">
                            <Shield className="w-6 h-6 text-emerald-400" />
                         </div>
                         <div>
                            <h4 className="text-white font-bold text-lg">Works offline</h4>
                            <p className="text-jade-500 text-sm">Your data stays safe locally and syncs automatically when connectivity returns.</p>
                         </div>
                      </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-xl bg-jade-800 flex items-center justify-center shrink-0 border border-jade-700">
                             <BrainCircuit className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                             <h4 className="text-white font-bold text-lg">Smart AI built in</h4>
                             <p className="text-jade-500 text-sm">Get intelligent insights for crop analysis, weather forecasting, and personalized agronomy advice.</p>
                         </div>
                      </div>
                 </div>
              </div>
              
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-emerald-500/10 blur-3xl rounded-full"></div>
                   <div className="relative bg-jade-950 border border-jade-800 rounded-3xl p-8 shadow-2xl">
                      <div className="flex justify-between items-center mb-8 pb-4 border-b border-jade-800">
                         <span className="text-jade-400 text-xs font-medium">Tech overview</span>
                        <div className="flex gap-2">
                           <div className="w-3 h-3 rounded-full bg-red-500"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                     </div>
                     <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-jade-500">Framework</span>
                            <span className="text-sky-400 font-medium">React 19</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-jade-500">Styling</span>
                            <span className="text-sky-400 font-medium">TailwindCSS</span>
                         </div>
                          <div className="flex justify-between">
                             <span className="text-jade-500">AI Engine</span>
                             <span className="text-purple-400 font-medium">Smart AI Advisor</span>
                          </div>
                         <div className="flex justify-between">
                            <span className="text-jade-500">Charts</span>
                            <span className="text-orange-400 font-medium">Recharts</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-jade-500">Icons</span>
                            <span className="text-white font-medium">Lucide</span>
                         </div>
                         <div className="mt-6 pt-4 border-t border-jade-800 text-xs text-jade-500">
                           All modules ready<br/>
                           Offline support enabled<br/>
                           Ready to grow with you
                        </div>
                     </div>
                  </div>
               </div>
           </div>
        </div>
      </div>

      {/* --- MISSION / ABOUT SECTION --- */}
      <div ref={aboutRef} className="relative z-10 w-full bg-jade-950 border-t border-jade-800 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 mb-6">
                 <div className="p-1.5 rounded-lg bg-green-500/20"><Leaf className="w-5 h-5 text-green-400"/></div>
                  <span className="text-green-400 font-semibold text-sm">Our mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Farming for the Next Century</h2>
              <p className="text-jade-400 text-lg leading-relaxed mb-6">
                 We believe that the future of agriculture lies at the intersection of traditional wisdom and advanced technology.
              </p>
              <p className="text-jade-400 text-lg leading-relaxed mb-8">
                In an era of climate uncertainty, AgriFlow provides the digital infrastructure needed to secure yields, protect soil health, and ensure profitability for generations to come.
              </p>
              
              <button 
                onClick={onStart}
                 className="px-8 py-4 bg-white text-jade-950 rounded-full font-bold hover:bg-green-400 transition-colors shadow-lg"
              >
                Get started
              </button>
            </div>
            
            <div className="order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-jade-800 group">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105"></div>
               <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/20 to-transparent"></div>
               <div className="absolute bottom-0 left-0 p-10 w-full bg-gradient-to-t from-jade-950/90 to-transparent">
                   <p className="text-white font-bold text-3xl font-heading mb-3">"Better data, better harvests."</p>
                    <p className="text-jade-400 text-sm font-medium">- The AgriFlow Team</p>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-jade-950 border-t border-jade-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-jade-600 text-sm">
           <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-8 h-8 rounded-lg" />
               <span className="font-medium text-jade-500">AgriFlow &copy; 2026</span>
           </div>
          <div className="flex gap-8">
            <button onClick={(e) => handlePlaceholderLink(e, 'Privacy')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0">Privacy</button>
            <button onClick={(e) => handlePlaceholderLink(e, 'Terms')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0">Terms</button>
            <button onClick={(e) => handlePlaceholderLink(e, 'API Docs')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0">API Docs</button>
            <button onClick={(e) => handlePlaceholderLink(e, 'Support')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0">Support</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GetStarted;
