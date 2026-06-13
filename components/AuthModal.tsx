
import React, { useState } from 'react';
import { X, User, Loader2, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Sprout, ChevronRight, Zap, Shield, Droplets, Leaf } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (name: string, email: string) => Promise<void>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authEmail && authName) {
      setIsAuthenticating(true);
      await onLogin(authName, authEmail);
      setIsAuthenticating(false);
      setAuthEmail('');
      setAuthName('');
      setAuthPassword('');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  if (!isOpen) return null;

  const features = [
    { icon: Zap, label: 'Real-time Monitoring', desc: 'Live field data & alerts', color: 'text-yellow-400' },
    { icon: Shield, label: 'Crop Disease Alerts', desc: 'AI-powered early detection', color: 'text-green-400' },
    { icon: Droplets, label: 'Smart Irrigation', desc: 'Automated water management', color: 'text-blue-400' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-lg animate-fade-in">
      <div className="w-full max-w-5xl mx-4 rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50 flex flex-col md:flex-row animate-fade-in-up">

        {/* Left Panel - Hero (Hidden on Mobile) */}
        <div className="hidden md:flex md:w-[45%] relative overflow-hidden bg-gradient-to-br from-slate-950 via-green-950/80 to-slate-900 flex-col justify-between p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-heading font-black text-xl tracking-tight">AgriFlow</span>
                <p className="text-green-400/70 text-[10px] font-semibold">Precision Agriculture</p>
              </div>
            </div>

            <h1 className="text-white font-heading font-black text-4xl leading-[1.1] mb-4">
              Farm Smarter.<br />
              <span className="text-green-400">Grow Better.</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              AI-powered insights, real-time crop monitoring, and market intelligence — all in one platform.
            </p>
          </div>

          <div className="relative z-10 space-y-5 my-8">
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="flex items-start gap-3.5 group">
                <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <span className="text-white text-sm font-semibold block group-hover:text-green-400 transition-colors">{label}</span>
                  <span className="text-slate-500 text-xs">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-heading font-black text-white">12K+</p>
                <p className="text-[10px] text-slate-500 font-semibold">Active Farms</p>
              </div>
              <div>
                <p className="text-2xl font-heading font-black text-green-400">34%</p>
                <p className="text-[10px] text-slate-500 font-semibold">Yield Increase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full md:w-[55%] bg-white dark:bg-slate-900 flex flex-col min-h-[600px] md:min-h-0">
          <div className="flex justify-between items-start px-8 pt-8 pb-2">
            <div>
              <h2 className="text-2xl font-heading font-black text-slate-900 dark:text-white tracking-tight">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                {isSignUp
                  ? 'Join thousands of farmers using AgriFlow.'
                  : 'Sign in to access your dashboard.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-500 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 px-8 py-6 overflow-y-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Leaf className="w-7 h-7 text-slate-900" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                  <Sprout className="w-3 h-3 text-white" />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="text"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="John Doe"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type="email"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-400">
                    Password
                  </label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-bold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-green-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Min. 8 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Device / Terms */}
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={e => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-green-500 focus:ring-green-500 dark:focus:ring-green-400 bg-slate-50 dark:bg-slate-800"
                />
                <label className="ml-2.5 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {isSignUp ? 'I agree to the Terms & Privacy Policy' : 'Remember this device'}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 flex items-center justify-center gap-2.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSignUp ? (
                  <UserPlus className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isAuthenticating
                  ? 'Please wait...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Sign In'}
                {!isAuthenticating && <ChevronRight className="w-4 h-4" />}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-3">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
                <span className="flex-shrink mx-4 text-[10px] font-semibold text-slate-400 dark:text-slate-500">or continue with</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800" />
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </button>
              </div>

              {/* Toggle Login/Signup */}
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium pt-2">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Create one'}
                </button>
              </p>
            </form>
          </div>

          <div className="px-8 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-600 font-medium">
              Secured with 256-bit encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
