export const STOCK_IMAGES = {
  // Crops
  'crop-default': '/stock/crop-default.svg',
  'maize': '/stock/crop-default.svg',
  'rice': '/stock/crop-default.svg',
  'cassava': '/stock/crop-default.svg',
  'sorghum': '/stock/crop-default.svg',
  'millet': '/stock/crop-default.svg',
  'cocoa': '/stock/fruit-tree.svg',
  'oil palm': '/stock/fruit-tree.svg',
  'groundnut': '/stock/crop-default.svg',
  'yam': '/stock/crop-default.svg',
  'vegetables': '/stock/crop-default.svg',
  'fruit tree': '/stock/fruit-tree.svg',

  // Livestock
  'cattle': '/stock/cattle.svg',
  'cow': '/stock/cattle.svg',
  'bull': '/stock/cattle.svg',
  'goat': '/stock/goat.svg',
  'sheep': '/stock/sheep.svg',
  'lamb': '/stock/sheep.svg',
  'chicken': '/stock/chicken.svg',
  'poultry': '/stock/chicken.svg',
  'hen': '/stock/chicken.svg',
  'pig': '/stock/pig.svg',
  'swine': '/stock/pig.svg',
  'horse': '/stock/horse.svg',
  'other livestock': '/stock/other-livestock.svg',

  // Categories
  marketplace: '/stock/marketplace.svg',
  news: '/stock/news.svg',
  user: '/stock/user.svg',
} as const;

export type StockImageKey = keyof typeof STOCK_IMAGES;

export function getStockImage(key: string): string {
  const normalized = key.toLowerCase().trim();
  // Try exact match first
  if (normalized in STOCK_IMAGES) {
    return STOCK_IMAGES[normalized as StockImageKey];
  }
  // Try partial match for crops/livestock
  for (const [k, v] of Object.entries(STOCK_IMAGES)) {
    if (normalized.includes(k)) return v;
  }
  // Fallback
  return '/stock/crop-default.svg';
}