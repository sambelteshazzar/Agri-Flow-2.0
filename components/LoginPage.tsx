import React, { useState, useCallback } from 'react';
import { useFarm } from '../contexts/FarmContext';
import {
  X, Loader2, Sprout, Mail, Lock, Eye, EyeOff, User,
  ArrowRight, Tractor, Globe, Wheat, Check
} from 'lucide-react';
import { COUNTRY_LIST } from '../constants';
import type { OnboardingData } from './AuthModal';

type AuthMode = 'signin' | 'signup';

interface LoginPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: { email: string; password: string; remember: boolean }) => Promise<void>;
  onSignup?: (data: OnboardingData & { email: string; password: string }) => Promise<void>;
}

const FARM_TYPES = [
  { value: 'crop', label: 'Crops', icon: Wheat, desc: 'Grains, vegetables, cash crops' },
  { value: 'livestock', label: 'Livestock', icon: Tractor, desc: 'Cattle, goats, poultry' },
  { value: 'mixed', label: 'Mixed', icon: Sprout, desc: 'Both crops & livestock' },
] as const;

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

  const filteredCountries = countrySearch
    ? COUNTRY_LIST.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRY_LIST;

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
  }, []);

  const switchMode = useCallback((m: AuthMode) => {
    resetForm();
    setMode(m);
  }, [resetForm]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      await onLogin({ email, password, remember });
      onClose();
    } catch {
      showToast('Login failed. Please try again.', 'error');
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
      className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'signin' ? 'Sign in to AgriFlow' : 'Create your AgriFlow account'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-field-950/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[960px] mx-4 my-4 flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/40 border border-field-800/60 animate-fade-in-up max-h-[92vh]">

        {/* ── LEFT PANEL (Branding) ── */}
        <div className="hidden md:flex w-[420px] shrink-0 relative overflow-hidden flex-col justify-between p-10 bg-field-950">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 animate-slow-zoom"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1527847263472-aa5338d178b8?q=80&w=1200&auto=format&fit=crop")' }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-field-950 via-field-950/80 to-field-950/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-field-950/60 to-transparent" />

          {/* Glow accent */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-field-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-harvest-500/8 rounded-full blur-3xl" />

          {/* Top: Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-11 h-11 bg-gradient-to-br from-field-500 to-harvest-500 rounded-xl flex items-center justify-center shadow-lg shadow-field-500/30">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white text-lg font-heading font-bold tracking-tight">Agri<span className="text-field-400">Flow</span></span>
              </div>
            </div>

            <h1 className="text-3xl font-display text-white leading-snug mb-3">
              Smart farming<br />starts here
            </h1>
            <p className="text-field-400 text-sm leading-relaxed max-w-[280px]">
              Your complete farming companion — from planting to harvest, with AI-powered insights by your side.
            </p>
          </div>

          {/* Bottom: Features */}
          <div className="relative z-10 space-y-5">
            <div className="space-y-4">
              {[
                { icon: Wheat, text: 'Track crops & livestock in real time' },
                { icon: Globe, text: 'Region-specific market prices & weather' },
                { icon: Sprout, text: 'AI-powered agronomy & diagnostics' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-field-300">
                  <div className="w-9 h-9 rounded-lg bg-field-800/60 border border-field-700/50 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-field-400" />
                  </div>
                  <span className="text-[13px] font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-field-600 font-medium">
              Trusted by 10,000+ farmers across West Africa
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL (Form) ── */}
        <div className="flex-1 bg-[var(--bg-card)] flex flex-col overflow-hidden">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-5 md:right-5 z-20 w-10 h-10 flex items-center justify-center rounded-xl bg-field-950/10 dark:bg-field-950/40 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-field-950/15 dark:hover:bg-field-950/50 transition-all border border-transparent hover:border-[var(--border-card)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mobile logo (visible only on small screens) */}
          <div className="md:hidden flex items-center gap-2.5 px-8 pt-8 pb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-field-500 to-harvest-500 rounded-lg flex items-center justify-center shadow-md shadow-field-500/20">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="text-[var(--text-primary)] text-base font-heading font-bold tracking-tight">Agri<span className="text-field-500">Flow</span></span>
          </div>

          {/* Scrollable Form Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 md:py-10">
            <div className="max-w-[380px] mx-auto w-full">

              {/* Header */}
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

              {/* ─── SIGN IN FORM ─── */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="signin-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Email address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value.trim())}
                        placeholder="you@farm.example.com"
                        required
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signin-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value.trim())}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-0.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={remember}
                          onChange={e => setRemember(e.target.checked)}
                          className="peer sr-only"
                        />
                        <div className="w-[18px] h-[18px] rounded-md border-2 border-[var(--border-card)] bg-[var(--bg-content)] peer-checked:bg-field-600 peer-checked:border-field-600 transition-all flex items-center justify-center group-hover:border-field-400">
                          {remember && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <span className="text-[var(--text-secondary)] text-[13px] font-medium">Remember this device</span>
                    </label>
                    <button type="button" className="text-field-600 dark:text-field-400 text-[13px] font-semibold hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-field-800 dark:bg-harvest-500 hover:bg-field-700 dark:hover:bg-harvest-400 text-white dark:text-field-950 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg shadow-field-500/15 dark:shadow-harvest-500/20 hover:shadow-field-500/25 dark:hover:shadow-harvest-500/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ─── SIGN UP FORM ─── */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Name + Farm Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="signup-name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Full name</label>
                      <div className="relative group">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                        <input
                          id="signup-name"
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Adewale Okonkwo"
                          required
                          autoComplete="name"
                          className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="signup-farm" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Farm name <span className="font-normal text-[var(--text-tertiary)]">(opt.)</span></label>
                      <div className="relative group">
                        <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                        <input
                          id="signup-farm"
                          type="text"
                          value={farmName}
                          onChange={e => setFarmName(e.target.value)}
                          placeholder="Greenfield Farm"
                          className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="signup-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Email address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value.trim())}
                        placeholder="you@farm.example.com"
                        required
                        autoComplete="email"
                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="signup-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value.trim())}
                        placeholder="Create a password"
                        required
                        autoComplete="new-password"
                        minLength={6}
                        className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-0.5"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="signup-confirm" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Confirm password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        id="signup-confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        required
                        autoComplete="new-password"
                        minLength={6}
                        className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-0.5"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && password !== confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords do not match</p>
                    )}
                  </div>

                  {/* Country Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Country</label>
                    <div className="relative group">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-field-500 transition-colors pointer-events-none" />
                      <input
                        type="text"
                        value={selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : countrySearch}
                        onChange={e => {
                          setSelectedCountry(null);
                          setCountrySearch(e.target.value);
                        }}
                        onFocus={() => {
                          if (selectedCountry) {
                            setSelectedCountry(null);
                            setCountrySearch('');
                          }
                        }}
                        placeholder="Search your country..."
                        required={!selectedCountry}
                        className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-field-500 focus:ring-0 transition-all outline-none"
                      />
                    </div>
                    {/* Country dropdown */}
                    {countrySearch && !selectedCountry && (
                      <div className="mt-1.5 max-h-44 overflow-y-auto rounded-xl border-2 border-[var(--border-card)] bg-[var(--bg-card)] shadow-xl custom-scrollbar">
                        {filteredCountries.length > 0 ? filteredCountries.map(c => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry({ code: c.code, name: c.name, flag: c.flag });
                              setCountrySearch('');
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-field-50 dark:hover:bg-field-900/20 transition-colors"
                          >
                            <span className="text-lg leading-none">{c.flag}</span>
                            <span className="text-sm font-medium text-[var(--text-primary)]">{c.name}</span>
                          </button>
                        )) : (
                          <div className="px-4 py-3 text-xs text-[var(--text-tertiary)] text-center">No countries found</div>
                        )}
                      </div>
                    )}
                    {selectedCountry && (
                      <div className="mt-1.5 flex items-center gap-2 px-3 py-2 bg-field-50 dark:bg-field-900/20 rounded-lg border border-field-200 dark:border-field-800">
                        <span className="text-base">{selectedCountry.flag}</span>
                        <span className="text-xs font-semibold text-field-700 dark:text-field-400">{selectedCountry.name}</span>
                        <button
                          type="button"
                          onClick={() => { setSelectedCountry(null); setCountrySearch(''); }}
                          className="ml-auto text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Farm Type */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Farm type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {FARM_TYPES.map(({ value, label, icon: Icon, desc }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setFarmType(value)}
                          className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-center ${
                            farmType === value
                              ? 'border-field-500 bg-field-50 dark:bg-field-900/20 shadow-md shadow-field-500/10'
                              : 'border-[var(--border-card)] bg-[var(--bg-content)] hover:border-field-300 dark:hover:border-field-700'
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${farmType === value ? 'text-field-500' : 'text-[var(--text-tertiary)]'}`} />
                          <span className={`text-[11px] font-bold leading-tight ${farmType === value ? 'text-field-700 dark:text-field-400' : 'text-[var(--text-primary)]'}`}>{label}</span>
                          <span className="text-[9px] text-[var(--text-tertiary)] leading-tight hidden sm:block">{desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sign Up Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !selectedCountry || password !== confirmPassword || confirmPassword.length < 6}
                    className="w-full bg-field-800 dark:bg-harvest-500 hover:bg-field-700 dark:hover:bg-harvest-400 text-white dark:text-field-950 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg shadow-field-500/15 dark:shadow-harvest-500/20 hover:shadow-field-500/25 dark:hover:shadow-harvest-500/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Mode Switcher */}
              <div className="mt-6 pt-5 border-t border-[var(--border-card)]">
                <p className="text-center text-[13px] text-[var(--text-secondary)] font-medium">
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    type="button"
                    onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
                    className="text-field-600 dark:text-field-400 font-bold hover:underline"
                  >
                    {mode === 'signin' ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </div>

            </div>
          </div>

          {/* Footer strip */}
          <div className="shrink-0 px-8 py-3.5 border-t border-[var(--border-card)] bg-[var(--bg-card-inner)]">
            <div className="flex items-center justify-between text-[11px] text-[var(--text-tertiary)] font-medium">
              <span>&copy; 2026 AgriFlow</span>
              <div className="flex gap-4">
                <button type="button" className="hover:text-[var(--text-secondary)] transition-colors">Privacy</button>
                <button type="button" className="hover:text-[var(--text-secondary)] transition-colors">Terms</button>
                <button type="button" className="hover:text-[var(--text-secondary)] transition-colors">Help</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
