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

/**
 * Render an ISO timestamp as a short relative-time label.
 * Reused across the app so alerts, posts, and replies stay consistent.
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Recently';
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}
