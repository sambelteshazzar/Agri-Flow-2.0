import { AreaUnit } from '../types';

export function formatCurrency(amount: number, currencyCode: string, currencySymbol: string): string {
  try {
    const localeMap: Record<string, string> = {
      NGN: 'en-NG', GHS: 'en-GH', KES: 'en-KE', INR: 'en-IN',
      BRL: 'pt-BR', USD: 'en-US', ETB: 'am-ET', XOF: 'fr-SN',
      AUD: 'en-AU', EUR: 'de-DE', THB: 'th-TH', MXN: 'es-MX',
    };
    const locale = localeMap[currencyCode] || 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencySymbol}${amount.toLocaleString()}`;
  }
}

export function formatArea(value: number, unit: AreaUnit): string {
  return `${value.toLocaleString()} ${unit === 'acres' ? 'acres' : 'ha'}`;
}

export function formatAreaLabel(unit: AreaUnit): string {
  return unit === 'acres' ? 'Acres' : 'Hectares';
}

export function formatDate(dateStr: string, language: string = 'en'): string {
  try {
    const localeMap: Record<string, string> = {
      en: 'en-US', fr: 'fr-FR', es: 'es-MX', pt: 'pt-BR',
      am: 'am-ET', th: 'th-TH', de: 'de-DE', hi: 'hi-IN',
    };
    const locale = localeMap[language] || 'en-US';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  } catch {
    return new Date(dateStr).toLocaleDateString();
  }
}

export function formatNumber(value: number, language: string = 'en'): string {
  try {
    const localeMap: Record<string, string> = {
      en: 'en-US', fr: 'fr-FR', es: 'es-MX', pt: 'pt-BR',
      am: 'am-ET', th: 'th-TH', de: 'de-DE', hi: 'hi-IN',
    };
    const locale = localeMap[language] || 'en-US';
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return value.toLocaleString();
  }
}
