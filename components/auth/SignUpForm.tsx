import React from 'react';
import { User, Tractor, Mail, Phone, MapPin, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import FARM_TYPES from './FARM_TYPES';

interface SignUpFormProps {
  name: string;
  setName: (v: string) => void;
  farmName: string;
  setFarmName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (v: boolean) => void;
  selectedCountry: { code: string; name: string; flag: string } | null;
  countrySearch: string;
  onCountrySelect: (c: { code: string; name: string; flag: string } | null) => void;
  onCountrySearchChange: (s: string) => void;
  farmType: string;
  setFarmType: (v: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  name,
  setName,
  farmName,
  setFarmName,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  location,
  setLocation,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  selectedCountry,
  countrySearch,
  onCountrySelect,
  onCountrySearchChange,
  farmType,
  setFarmType,
  isLoading,
  onSubmit,
}) => {
  const cc = selectedCountry?.code;
  const phoneHint = cc === 'NG' ? '+234 801 234 5678'
    : cc === 'GH' ? '+233 24 123 4567'
    : cc === 'KE' ? '+254 712 345 678'
    : cc === 'ET' ? '+251 91 234 5678'
    : '+1 234 567 8900';
  const locationHint = cc === 'NG' ? 'Kano, Kano State'
    : cc === 'GH' ? 'Kumasi, Ashanti Region'
    : cc === 'KE' ? 'Eldoret, Uasin Gishu County'
    : cc === 'ET' ? 'Hawassa, SNNPR'
    : 'City, Region';

  return (
  <form
    onSubmit={onSubmit}
    action="#"
    method="post"
    autoComplete="on"
    className="space-y-5"
  >
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="signup-name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Full name</label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
          <input
            id="signup-name"
            name="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Adewale Okonkwo"
            required
            autoComplete="name"
            className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="signup-farm" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Farm name <span className="font-normal text-[var(--text-tertiary)]">(opt.)</span></label>
        <div className="relative group">
          <Tractor className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
          <input
            id="signup-farm"
            name="organization"
            type="text"
            value={farmName}
            onChange={e => setFarmName(e.target.value)}
            placeholder="Greenfield Farm"
            autoComplete="organization"
            className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="signup-email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Email address</label>
      <div className="relative group">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          id="signup-email"
          name="email"
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

    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="signup-phone" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Phone number</label>
        <div className="relative group">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
          <input
            id="signup-phone"
            name="tel"
            type="tel"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            placeholder={phoneHint}
            autoComplete="tel"
            className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>
      <div>
        <label htmlFor="signup-location" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Location <span className="font-normal text-[var(--text-tertiary)]">(city/region)</span></label>
        <div className="relative group">
          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
          <input
            id="signup-location"
            name="address-level2"
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder={locationHint}
            autoComplete="address-level2"
            className="w-full pl-11 pr-3 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
          />
        </div>
      </div>
    </div>

    <div>
      <label htmlFor="signup-password" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Password</label>
      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          id="signup-password"
          name="new-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Create a password"
          required
          autoComplete="new-password"
          minLength={6}
          className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1.5 cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>

    <div>
      <label htmlFor="signup-confirm" className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Confirm password</label>
      <div className="relative group">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          id="signup-confirm"
          name="new-password-confirm"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          required
          autoComplete="new-password"
          minLength={6}
          className="w-full pl-11 pr-12 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1.5 cursor-pointer"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {confirmPassword && password !== confirmPassword && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">Passwords do not match</p>
      )}
    </div>

    <CountrySelector
      selectedCountry={selectedCountry}
      countrySearch={countrySearch}
      onCountrySelect={onCountrySelect}
      onCountrySearchChange={onCountrySearchChange}
    />

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
                ? 'border-jade-500 bg-jade-50 dark:bg-jade-900/20 shadow-md shadow-jade-500/10'
                : 'border-[var(--border-card)] bg-[var(--bg-content)] hover:border-jade-300 dark:hover:border-jade-700'
            }`}
          >
            <Icon className={`w-5 h-5 ${farmType === value ? 'text-jade-500' : 'text-[var(--text-tertiary)]'}`} />
            <span className={`text-[11px] font-bold leading-tight ${farmType === value ? 'text-jade-700 dark:text-jade-400' : 'text-[var(--text-primary)]'}`}>{label}</span>
            <span className="text-[9px] text-[var(--text-tertiary)] leading-tight hidden sm:block">{desc}</span>
          </button>
        ))}
      </div>
    </div>

    <button
      type="submit"
      disabled={isLoading || !selectedCountry || password !== confirmPassword || confirmPassword.length < 6}
      className="w-full bg-jade-800 dark:bg-sunburst-500 hover:bg-jade-700 dark:hover:bg-sunburst-400 text-white dark:text-jade-950 py-3.5 font-bold text-sm rounded-xl transition-all shadow-lg shadow-jade-500/15 dark:shadow-sunburst-500/20 hover:shadow-jade-500/25 dark:hover:shadow-sunburst-500/30 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
};
