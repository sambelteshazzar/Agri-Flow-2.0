import React from 'react';
import { X, Globe } from 'lucide-react';
import { COUNTRY_LIST } from '@/constants';

interface CountrySelectorProps {
  selectedCountry: { code: string; name: string; flag: string } | null;
  countrySearch: string;
  onCountrySelect: (country: { code: string; name: string; flag: string } | null) => void;
  onCountrySearchChange: (search: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  countrySearch,
  onCountrySelect,
  onCountrySearchChange,
}) => {
  const filteredCountries = countrySearch
    ? COUNTRY_LIST.filter(c =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRY_LIST;

  return (
    <div>
      <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-2">Country</label>
      <div className="relative group">
        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)] group-focus-within:text-jade-500 transition-colors pointer-events-none" />
        <input
          type="text"
          value={selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : countrySearch}
          onChange={e => {
            onCountrySelect(null);
            onCountrySearchChange(e.target.value);
          }}
          onFocus={() => {
            if (selectedCountry) {
              onCountrySelect(null);
              onCountrySearchChange('');
            }
          }}
          placeholder="Search your country..."
          required={!selectedCountry}
          className="w-full pl-11 pr-4 py-3.5 bg-[var(--bg-content)] border-2 border-[var(--border-card)] rounded-xl text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-jade-500 focus:ring-0 transition-all outline-none"
        />
      </div>
      {countrySearch && !selectedCountry && (
        <div className="mt-1.5 max-h-44 overflow-y-auto rounded-xl border-2 border-[var(--border-card)] bg-[var(--bg-card)] shadow-xl custom-scrollbar">
          {filteredCountries.length > 0 ? filteredCountries.map(c => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onCountrySelect({ code: c.code, name: c.name, flag: c.flag });
                onCountrySearchChange('');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-jade-50 dark:hover:bg-jade-900/20 transition-colors"
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
        <div className="mt-1.5 flex items-center gap-2 px-3 py-2 bg-jade-50 dark:bg-jade-900/20 rounded-lg border border-jade-200 dark:border-jade-800">
          <span className="text-base">{selectedCountry.flag}</span>
          <span className="text-xs font-semibold text-jade-700 dark:text-jade-400">{selectedCountry.name}</span>
          <button
            type="button"
            onClick={() => { onCountrySelect(null); onCountrySearchChange(''); }}
            className="ml-auto text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
