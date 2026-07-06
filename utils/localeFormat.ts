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
