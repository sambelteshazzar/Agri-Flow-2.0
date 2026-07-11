import React, { useState, useCallback } from 'react';
import { useFarm } from '../contexts/FarmContext';
import { X, Wheat, Globe, Sprout } from 'lucide-react';
import type { OnboardingData } from '../types';
import { SignInForm } from './auth/SignInForm';
import { SignUpForm } from './auth/SignUpForm';

type AuthMode = 'signin' | 'signup';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: { email: string; password: string; remember: boolean }) => Promise<void>;
  onSignup?: (data: OnboardingData & { email: string; password: string }) => Promise<void>;
}

export const LoginPage: React.FC<LoginPageProps> = ({ isOpen, onClose, onLogin, onSignup }) => {
  const { showToast } = useFarm();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [farmName, setFarmName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ code: string; name: string; flag: string } | null>(null);
  const [countrySearch, setCountrySearch] = useState('');
  const [farmType, setFarmType] = useState<string>('mixed');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setFarmName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRemember(false);
    setSelectedCountry(null);
    setCountrySearch('');
    setFarmType('mixed');
    setPhoneNumber('');
    setLocation('');
  }, []);

  const switchMode = useCallback((m: AuthMode) => {
    resetForm();
    setMode(m);
  }, [resetForm]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (!trimmedEmail || !trimmedPassword) {
      showToast('Please enter both email and password.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin({ email: trimmedEmail, password: trimmedPassword, remember });
      onClose();
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your name.', 'error');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (!selectedCountry) {
      showToast('Please select your country.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const signupData: OnboardingData & { email: string; password: string } = {
        name: name.trim(),
        farmName: farmName.trim() || `${name.trim()}'s Farm`,
        countryCode: selectedCountry.code,
        farmType: farmType as OnboardingData['farmType'],
        farmSize: 1,
        areaUnit: 'ha',
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        email,
        password,
      };
      if (onSignup) {
        await onSignup(signupData);
      }
      onClose();
    } catch {
      showToast('Sign up failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-full-modal flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'signin' ? 'Sign in to AgriFlow' : 'Create your AgriFlow account'}
    >
      <div
        className="absolute inset-0 bg-jade-950/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[960px] mx-4 my-4 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-jade-800/60 animate-fade-in-up max-h-[92vh]">

        <div className="hidden md:flex w-[420px] shrink-0 relative overflow-hidden flex-col justify-between p-10 bg-jade-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-75 animate-slow-zoom"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=1200&auto=format&fit=crop")' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-jade-950 via-jade-950/50 to-jade-950/20" />

          <div className="absolute -top-20 -right-20 w-80 h-80 bg-jade-500/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-sunburst-500/12 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-11 h-11 rounded-xl shadow-lg shadow-jade-500/30" />
              <div>
                <span className="text-white text-lg font-heading font-bold tracking-tight">Agri<span className="text-jade-400">Flow</span></span>
              </div>
            </div>

            <h1 className="text-3xl font-display text-white leading-snug mb-3">
              Smart farming<br />starts here
            </h1>
            <p className="text-jade-400 text-sm leading-relaxed max-w-[280px]">
              Your complete farming companion — from planting to harvest, with AI-powered insights by your side.
            </p>
          </div>

          <div className="relative z-10 space-y-5">
            <div className="space-y-4">
              {[
                { icon: Wheat, text: 'Track crops & livestock in real time' },
                { icon: Globe, text: 'Region-specific market prices & weather' },
                { icon: Sprout, text: 'AI-powered agronomy & diagnostics' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-jade-300">
                  <div className="w-9 h-9 rounded-lg bg-jade-800/60 border border-jade-700/50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-jade-400" />
                  </div>
                  <span className="text-[13px] font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-jade-600 font-medium">
              Designed for farmers across West Africa
            </p>
          </div>
        </div>

        <div className="flex-1 bg-[var(--bg-card)] flex flex-col overflow-hidden">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-10 h-10 flex items-center justify-center rounded-xl bg-jade-950/10 dark:bg-jade-950/40 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-jade-950/15 dark:hover:bg-jade-950/50 transition-all border border-transparent hover:border-[var(--border-card)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="md:hidden flex items-center gap-2.5 px-8 pt-8 pb-2">
            <img src="/logo-AgriFlow.png" alt="AgriFlow" className="w-9 h-9 rounded-lg shadow-md shadow-jade-500/20" />
            <span className="text-[var(--text-primary)] text-base font-heading font-bold tracking-tight">Agri<span className="text-jade-500">Flow</span></span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 md:py-10">
            <div className="max-w-[380px] mx-auto w-full">

              <div className="mb-8">
                <h2 className="text-2xl md:text-[28px] font-heading font-bold text-[var(--text-primary)] leading-tight">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="mt-2 text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                  {mode === 'signin'
                    ? 'Sign in to access your farm dashboard.'
                    : 'Get started with AgriFlow in minutes.'}
                </p>
              </div>

              {mode === 'signin' && (
                <SignInForm
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  remember={remember}
                  setRemember={setRemember}
                  isLoading={isLoading}
                  onSubmit={handleSignIn}
                />
              )}

              {mode === 'signup' && (
                <SignUpForm
                  name={name}
                  setName={setName}
                  farmName={farmName}
                  setFarmName={setFarmName}
                  email={email}
                  setEmail={setEmail}
                  phoneNumber={phoneNumber}
                  setPhoneNumber={setPhoneNumber}
                  location={location}
                  setLocation={setLocation}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  showConfirmPassword={showConfirmPassword}
                  setShowConfirmPassword={setShowConfirmPassword}
                  selectedCountry={selectedCountry}
                  countrySearch={countrySearch}
                  onCountrySelect={setSelectedCountry}
                  onCountrySearchChange={setCountrySearch}
                  farmType={farmType}
                  setFarmType={setFarmType}
                  isLoading={isLoading}
                  onSubmit={handleSignUp}
                />
              )}

              <div className="mt-6 pt-5 border-t border-[var(--border-card)]">
                <p className="text-center text-[13px] text-[var(--text-secondary)] font-medium">
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-jade-600 dark:text-jade-400 font-bold hover:underline"
                  >
                    {mode === 'signin' ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </div>

            </div>
          </div>

          <div className="shrink-0 px-8 py-3.5 border-t border-[var(--border-card)] bg-[var(--bg-card-inner)]">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] font-medium">
              <div className="flex items-center gap-1.5">
                <img src="/logo-AgriFlow.png" alt="" className="w-3.5 h-3.5 rounded-sm" />
                <span>&copy; 2026 AgriFlow</span>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => showToast('Privacy policy available at agriflow.ai/privacy', 'info')} className="hover:text-[var(--text-secondary)] transition-colors">Privacy</button>
                <button type="button" onClick={() => showToast('Terms of service available at agriflow.ai/terms', 'info')} className="hover:text-[var(--text-secondary)] transition-colors">Terms</button>
                <button type="button" onClick={() => showToast('Help center available at agriflow.ai/help', 'info')} className="hover:text-[var(--text-secondary)] transition-colors">Help</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
