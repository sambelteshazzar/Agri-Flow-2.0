
import React, { useState } from 'react';
import { X, User, Loader2, LogIn, UserPlus, Mail, Lock, Eye, EyeOff, Sprout, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl mx-4 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row animate-fade-in-up">

        {/* Left Panel - Hero (Hidden on Mobile) */}
        <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-slate-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a50610fb?w=800&q=80"
              alt="Modern Greenhouse"
              className="w-full h-full object-cover animate-slow-zoom"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-green-900/40 to-slate-950/20" />
          <div className="absolute inset-0 flex flex-col justify-end p-10">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-heading font-bold text-lg tracking-tight">AgriFlow</span>
              </div>
              <h1 className="text-white font-heading font-bold text-3xl leading-tight mb-3">
                Precision Grounded<br />in Nature.
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs">
                Harness the power of real-time telemetry and data-driven insights to transform your yields.
              </p>
            </div>
            <div className="flex gap-6 border-t border-slate-700/50 pt-5">
              <div className="flex items-center gap-2 text-slate-400">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Yield +34%</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <BarChart3 className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Live Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Auth Form */}
        <div className="w-full md:w-1/2 bg-white dark:bg-slate-900 flex flex-col">
          {/* Form Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-heading font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {isSignUp ? 'Create Account' : 'Access Terminal'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isSignUp ? 'Start your precision agriculture journey.' : 'Enter credentials to access the platform.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form Body */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Avatar / Brand Mark */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <User className="w-8 h-8 text-slate-900" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Operator Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2 tracking-wider">
                  Operator Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="e.g. John Doe"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase mb-2 tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={authEmail}
                    onChange={e => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="name@farm-enterprise.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  {!isSignUp && (
                    <button type="button" className="text-xs font-bold text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-wider">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Device / Terms */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberDevice}
                  onChange={e => setRememberDevice(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-green-500 focus:ring-green-500 dark:focus:ring-green-400 bg-slate-50 dark:bg-slate-800"
                />
                <label className="ml-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {isSignUp ? 'I agree to the Terms & Privacy Policy' : 'Remember this device'}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-lg hover:opacity-90 transition-all shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSignUp ? (
                  <UserPlus className="w-5 h-5" />
                ) : (
                  <LogIn className="w-5 h-5" />
                )}
                {isAuthenticating
                  ? 'Authenticating...'
                  : isSignUp
                  ? 'Create Account'
                  : 'Initialize Session'}
                {!isAuthenticating && <ChevronRight className="w-4 h-4" />}
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
                <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700" />
              </div>

              {/* Toggle Login/Signup */}
              <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
                {isSignUp ? "Already have an account?" : "Don't have an account yet?"}{' '}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-yellow-500 hover:text-yellow-400 font-bold transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Create an Account'}
                </button>
              </p>
            </form>
          </div>

          {/* Footer Icons */}
          <div className="px-8 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center items-center gap-4 opacity-30">
            <Sprout className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <TrendingUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <BarChart3 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
