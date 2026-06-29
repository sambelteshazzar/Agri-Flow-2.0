
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Send, Loader2, Sparkles, Info, BrainCircuit, ExternalLink, Globe, X, Phone, Mic, MicOff, Activity } from 'lucide-react';
import { getFarmingAdvice, analyzeCropImage, CountryContext, isAIConfigured, hasLiveVoice, getLiveAIClient } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useFarm } from '../contexts/FarmContext';
import { LiveServerMessage, Modality } from "@google/genai";

const AIAdvisor: React.FC = () => {
  const { showToast, userProfile } = useFarm();

  const countryCtx: CountryContext | undefined = userProfile.countryCode ? {
    countryCode: userProfile.countryCode,
    region: userProfile.region || '',
    climateZone: userProfile.climateZone || 'temperate',
    currencyCode: userProfile.currencyCode || 'USD',
    currencySymbol: userProfile.currencySymbol || '$',
    language: userProfile.language || 'en',
    farmType: userProfile.farmType || 'mixed',
    areaUnit: userProfile.areaUnit || 'ha',
  } : undefined;

  const userNameRef = useRef(userProfile.name);
  userNameRef.current = userProfile.name;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Your farming companion is ready.\n\nI can help analyze crop images for health issues, review soil reports, or explore market trends. Tap the phone icon for a live voice consultation.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [includeContext, setIncludeContext] = useState(false);
  const [soilContext, setSoilContext] = useState('');
  
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnectingCall, setIsConnectingCall] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const lastVolumeUpdateRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const b64ToUint8Array = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const floatTo16BitPCM = (input: Float32Array) => {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const startCall = async () => {
    if (!isAIConfigured()) {
      showToast("API Key missing", "error");
      return;
    }

    if (!hasLiveVoice()) {
      showToast("Live voice requires a Gemini API key", "error");
      return;
    }

    setIsConnectingCall(true);
    try {
      const ai = getLiveAIClient();
      if (!ai) {
        showToast("Live voice unavailable with current provider", "error");
        setIsConnectingCall(false);
        return;
      }
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 16000 });
      await ctx.resume();
      
      audioContextRef.current = ctx;
      nextStartTimeRef.current = ctx.currentTime;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, sampleRate: 16000 } });
      mediaStreamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: {
            parts: [{ text: `You are AgriFlow's Senior Agricultural Consultant. 
            You are speaking with ${userNameRef.current}.
            Provide detailed, scientific, yet practical farming advice.
            Focus on regenerative agriculture, cost-savings, and yield optimization.
            Keep responses conversational but concise.` }]
          },
        },
        callbacks: {
          onopen: () => {
            setIsCallActive(true);
            setIsConnectingCall(false);
            
            const source = ctx.createMediaStreamSource(stream);
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = async (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              const now = Date.now();
              if (now - lastVolumeUpdateRef.current > 100) {
                let sum = 0;
                for(let i=0; i<inputData.length; i+=10) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / (inputData.length / 10));
                setVolumeLevel(Math.min(100, rms * 400));
                lastVolumeUpdateRef.current = now;
              }

              const pcm16 = floatTo16BitPCM(inputData);
              const b64Data = arrayBufferToBase64(pcm16.buffer);
              
              try {
                const session = await sessionPromise;
                if (session) session.sendRealtimeInput({
                  media: { 
                    mimeType: `audio/pcm;rate=${ctx.sampleRate}`, 
                    data: b64Data 
                  }
                });
              } catch (_e) {
                // Session closed or not ready — ignore stale sends
              }
            };

            source.connect(processor);
            processor.connect(ctx.destination);
            sourceNodeRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData) {
              const audioBytes = b64ToUint8Array(audioData);
              const int16Data = new Int16Array(audioBytes.buffer);
              const audioBuffer = ctx.createBuffer(1, int16Data.length, 24000);
              const channelData = audioBuffer.getChannelData(0);
              for (let i = 0; i < int16Data.length; i++) {
                channelData[i] = int16Data[i] / 32768.0;
              }
              
              const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.start(startTime);
              
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
              nextStartTimeRef.current = startTime + audioBuffer.duration;
            }

            if (msg.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = ctx.currentTime;
            }
          },
          onclose: () => endCall(),
          onerror: (err) => {
            console.error(err);
            endCall();
            showToast("Connection lost", "error");
          }
        }
      });
    } catch (e) {
      console.error(e);
      setIsConnectingCall(false);
      showToast("Microphone access failed", "error");
    }
  };

  const endCall = useCallback(() => {
    setIsCallActive(false);
    setIsConnectingCall(false);
    setVolumeLevel(0);
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    const ctx = audioContextRef.current;
    if (ctx) {
      audioContextRef.current = null;
      if (ctx.state !== 'closed') {
        ctx.close().catch(e => console.debug("Error closing AudioContext:", e));
      }
    }
    
    activeSourcesRef.current.forEach(s => { try { s.stop(); } catch(e){} });
    activeSourcesRef.current.clear();
  }, []);

  useEffect(() => {
    return () => { endCall(); };
  }, [endCall]);

  const formatMessage = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') 
      .replace(/\*(.*?)\*/g, '$1')     
      .replace(/^#+\s/gm, '')          
      .replace(/^\s*\*\s/gm, '• ');    
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIncludeContext(true); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    let finalPrompt = inputText;
    if (includeContext && soilContext) {
      finalPrompt = `${inputText}\n\n[Context: Soil Texture/Condition: ${soilContext}]`;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: finalPrompt,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setSoilContext('');
    setSelectedImage(null);
    setIncludeContext(false);
    setIsLoading(true);

    try {
      let responseText = '';
      let responseSources = undefined;

      if (userMsg.image) {
        responseText = await analyzeCropImage(userMsg.image, userMsg.text, countryCtx);
      } else {
        const result = await getFarmingAdvice(userMsg.text, countryCtx);
        responseText = result.text;
        responseSources = result.sources;
      }

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        sources: responseSources,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Something went wrong processing that request. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col md:h-[calc(100vh-3rem)] relative">
      
      {isCallActive && (
        <div className="absolute inset-0 z-ai-overlay bg-jade-950/95 flex flex-col items-center justify-center animate-fade-in">
           <div className="relative w-full max-w-md p-8 flex flex-col items-center text-center">
              <div className="mb-8 relative">
                 <div className="w-32 h-32 rounded-full bg-sunburst-500/20 flex items-center justify-center animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-sunburst-500/40 flex items-center justify-center">
                       <Mic className="w-12 h-12 text-sunburst-400" />
                    </div>
                 </div>
                 <div className="absolute inset-0 border-4 border-sunburst-500/30 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                 <div className="absolute inset-0 border-4 border-sunburst-500/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
              </div>
              
               <h3 className="text-2xl font-bold text-white mb-2 font-heading">Live Consultation</h3>
               <p className="text-jade-300 mb-8 text-sm">Voice call with your AI advisor</p>
              
               <div className="flex gap-1 h-12 items-end justify-center mb-10 w-full max-w-[200px]">
                  {[...Array(8)].map((_, i) => (
                     <div 
                       key={i} 
                       className="w-3 bg-sunburst-500 rounded-t-sm transition-all duration-75"
                       style={{ 
                         height: `${Math.max(10, volumeLevel * (0.4 + i * 0.1))}%`,
                         opacity: 0.5 + (volumeLevel / 200) 
                       }}
                     ></div>
                  ))}
               </div>

                <button 
                  onClick={endCall}
                  aria-label="End call"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-lg shadow-red-600/30 transition-transform hover:scale-110 active:scale-95"
                >
                   <Phone className="w-8 h-8 rotate-[135deg]" aria-hidden="true" />
               </button>
               <p className="text-jade-400 mt-4 text-xs font-semibold">End Call</p>
           </div>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between organic-divider pb-2 transition-colors">
        <div>
           <h2 className="text-2xl font-bold text-primary-dynamic font-heading flex items-center">
             <BrainCircuit className="w-6 h-6 text-sunburst-500 mr-2" aria-hidden="true" />
             AI Consultant
           </h2>
            <p className="text-secondary-dynamic text-xs font-semibold">AI Assistant / Live Search / Vision</p>
        </div>
        <button 
          onClick={isCallActive ? endCall : startCall}
          disabled={isConnectingCall || !hasLiveVoice()}
          title={!hasLiveVoice() ? 'Live voice requires Gemini API key' : undefined}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-md
            ${!hasLiveVoice() ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' : isConnectingCall ? 'bg-terra-100 text-terra-500 dark:bg-jade-800 dark:text-jade-400' : 'bg-jade-800 dark:bg-sunburst-100 text-white dark:text-jade-900 hover:bg-jade-700 dark:hover:bg-sunburst-200'}
          `}
        >
          {isConnectingCall ? <Loader2 className="w-4 h-4 animate-spin"/> : <Phone className="w-4 h-4" />}
          {isConnectingCall ? 'Connecting...' : !hasLiveVoice() ? 'Voice (Gemini)' : 'Voice Call'}
        </button>
      </div>

      <div className="flex-1 bg-content border border-primary-dynamic rounded-lg shadow-inner overflow-hidden flex flex-col transition-colors relative">
        
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          role="log"
          aria-live="polite"
          aria-label="Chat History"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[90%] md:max-w-[80%] rounded p-4 shadow-sm border-l-4
                ${msg.role === 'user' 
                  ? 'bg-card-dynamic border-l-jade-400 dark:border-l-jade-500 text-primary-dynamic' 
                  : 'bg-jade-800 dark:bg-jade-900 text-jade-100 border-l-sunburst-500'}
              `}>
                {msg.role === 'model' && (
                  <div className="flex items-center mb-2 pb-2 border-b border-jade-600">
                    <Sparkles className="w-3 h-3 mr-2 text-sunburst-500" aria-hidden="true" />
                    <span className="text-[10px] font-semibold text-jade-300">Analysis</span>
                  </div>
                )}
                
                {msg.image && (
                  <div className="p-1 bg-terra-100 dark:bg-jade-700 mb-2 rounded w-fit">
                    <img src={msg.image} alt="User uploaded image" className="max-h-40 object-cover rounded-sm" />
                  </div>
                )}
                
                <div className="prose prose-sm max-w-none text-sm font-medium dark:prose-invert">
                   <p className="whitespace-pre-wrap leading-relaxed">{formatMessage(msg.text)}</p>
                </div>

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-jade-700">
                    <div className="flex items-center gap-1 mb-2 text-jade-300">
                      <Globe className="w-3 h-3" />
                      <span className="text-[10px] font-semibold">Sources</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((source, idx) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2 py-1 bg-jade-700 hover:bg-jade-600 rounded text-[10px] text-jade-200 transition-colors border border-jade-600"
                        >
                          <span className="truncate max-w-[150px]">{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-[10px] mt-2 text-right opacity-50 text-jade-400">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-jade-800 dark:bg-jade-900 rounded p-3 flex items-center gap-3 shadow-md">
                <Loader2 className="w-4 h-4 animate-spin text-sunburst-500" aria-hidden="true" />
                <span className="text-xs font-semibold text-jade-300">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-card-dynamic border-t border-primary-dynamic transition-colors">
          {selectedImage && (
            <div className="mb-3 flex items-center justify-between p-2 bg-terra-50 dark:bg-jade-800 border border-primary-dynamic rounded">
              <div className="flex items-center gap-3">
                <img src={selectedImage} alt="Thumbnail of attached image" className="w-10 h-10 object-cover rounded-sm" />
                <div>
                   <p className="text-xs font-semibold text-primary-dynamic">Image Attached</p>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedImage(null); setIncludeContext(false); }}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold focus:outline-none focus:underline"
              >
                Remove
              </button>
            </div>
          )}

          {includeContext && (
             <div className="mb-3 p-2 bg-terra-50 dark:bg-jade-900/50 rounded border border-primary-dynamic animate-fade-in">
                <div className="flex items-center gap-2 mb-1 text-secondary-dynamic">
                   <Info className="w-4 h-4" aria-hidden="true" />
                   <label htmlFor="contextInput" className="text-xs font-semibold">Additional Context</label>
                </div>
                <input
                   id="contextInput"
                   type="text"
                   value={soilContext}
                   onChange={(e) => setSoilContext(e.target.value)}
                   placeholder="Enter soil conditions, weather, etc..."
                   className="w-full text-sm p-2 bg-card-dynamic border border-primary-dynamic focus:outline-none focus:border-sunburst-500 font-bold text-primary-dynamic placeholder-jade-400"
                />
             </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
            
            <div className="flex flex-col gap-2">
               <button
                 type="button"
                 onClick={() => setIncludeContext(!includeContext)}
                 className={`p-3 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sunburst-500 ${includeContext ? 'bg-terra-200 dark:bg-jade-700 border-terra-400 dark:border-jade-500' : 'bg-card-dynamic border-primary-dynamic hover:bg-terra-50 dark:hover:bg-jade-800'} text-secondary-dynamic`}
                 title="Add Context"
               >
                 <Info className="w-5 h-5" aria-hidden="true" />
               </button>
               <button
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className={`p-3 rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-sunburst-500 ${selectedImage ? 'bg-terra-200 dark:bg-jade-700 border-terra-400 dark:border-jade-500' : 'bg-card-dynamic border-primary-dynamic hover:bg-terra-50 dark:hover:bg-jade-800'} text-secondary-dynamic`}
                 title="Upload Image"
               >
                 <Camera className="w-5 h-5" aria-hidden="true" />
               </button>
            </div>
            
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask AI or search live markets..."
                className="w-full h-full min-h-[60px] max-h-[160px] pl-4 pr-4 py-3 bg-card-dynamic border border-primary-dynamic rounded focus:outline-none focus:ring-2 focus:ring-sunburst-500 focus:border-transparent resize-none text-sm font-bold text-primary-dynamic placeholder-jade-400"
              />
            </div>
            
            <button
              type="submit"
              aria-label="Send message"
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="p-3 mb-[2px] bg-sunburst-500 text-jade-900 rounded hover:bg-sunburst-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center h-[60px] w-[60px] focus:outline-none focus:ring-2 focus:ring-jade-800"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" /> : <Send className="w-6 h-6" aria-hidden="true" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
