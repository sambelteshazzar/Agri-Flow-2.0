export const STOCK_IMAGES = {
  // Crops
  'crop-default': '/stock/crop-default.svg',
  'maize': '/stock/maize.svg',
  'rice': '/stock/rice.svg',
  'cassava': '/stock/cassava.svg',
  'sorghum': '/stock/sorghum.svg',
  'millet': '/stock/millet.svg',
  'cocoa': '/stock/cocoa.svg',
  'oil palm': '/stock/oil-palm.svg',
  'groundnut': '/stock/groundnut.svg',
  'yam': '/stock/yam.svg',
  'vegetables': '/stock/vegetable.svg',
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

  // News categories
  'technews': '/stock/tech-news.svg',
  'marketnews': '/stock/market-news.svg',
  'climatenews': '/stock/climate-news.svg',
  'policynews': '/stock/policy-news.svg',

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