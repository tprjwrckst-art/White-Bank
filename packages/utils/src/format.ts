export function formatCurrency(amount: string, currency = 'USD', locale = 'en-US'): string {
  const num = Number(amount);
  if (Number.isNaN(num)) return amount;
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(num);
}

export function formatDate(iso: string, locale = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(locale, options ?? { dateStyle: 'medium', timeStyle: 'short' }).format(d);
  } catch {
    return iso;
  }
}

/**
 * Safe decimal rounding to fixed decimals. Uses Number internally — for high-precision money
 * calculations use a proper decimal library (decimal.js / big.js / bignumber.js) in the future.
 */
export function toFixedDecimal(amount: string | number, decimals = 2): string {
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return String(amount);
  return num.toFixed(decimals);
}
