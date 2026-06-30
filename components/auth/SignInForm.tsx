import React from 'react';
import { Mail, Lock, Eye, EyeOff, Check, Loader2, ArrowRight } from 'lucide-react';
import { useFarm } from '../../contexts/FarmContext';

interface SignInFormProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  remember: boolean;
  setRemember: (v: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  remember,
  setRemember,
  isLoading,
  onSubmit,
}) => {
  const { showToast, userProfile } = useFarm();
  const phonePlaceholder = userProfile.countryCode === 'NG' ? '0801 234 5678'
    : userProfile.countryCode === 'GH' ? '024 123 4567'
    : userProfile.countryCode === 'KE' ? '0712 345 678'
    : '+1 234 567 8900';

  return (
  <form onSubmit={onSubmit} className="space-y-5">
    <div>
      <label htmlFor="signin-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Email address</label>
      <div className="relative group">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          id="signin-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@farm.example.com"
          required
          autoComplete="email"
          className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
        />
      </div>
    </div>

    <div>
      <label htmlFor="signin-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Password</label>
      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          id="signin-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
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

    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2.5 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="peer sr-only"
          />
          <div className="w-[18px] h-[18px] rounded-md border-2 border-[var(--border-card)] bg-[var(--bg-content)] peer-checked:bg-jade-600 peer-checked:border-jade-600 transition-all flex items-center justify-center group-hover:border-jade-400">
            {remember && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
        </div>
        <span className="text-[var(--text-secondary)] text-[13px] font-medium">Remember this device</span>
      </label>
      <button type="button" onClick={() => showToast('Password reset is not available in this demo. Contact support for help.', 'info')} className="text-jade-600 dark:text-jade-400 text-[13px] font-semibold hover:underline">
        Forgot password?
      </button>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-jade-800 dark:bg-sunburst-500 hover:bg-jade-700 dark:hover:bg-sunburst-400 text-white dark:text-jade-950 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg shadow-jade-500/15 dark:shadow-sunburst-500/20 hover:shadow-jade-500/25 dark:hover:shadow-sunburst-500/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};
