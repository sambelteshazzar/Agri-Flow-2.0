export const PLACEHOLDER_IMAGES = {
  crop: '/stock/crop-default.svg',
  livestock: '/stock/other-livestock.svg',
  news: '/stock/news.svg',
  marketplace: '/stock/marketplace.svg',
  user: '/stock/user.svg',
} as const;

export type PlaceholderType = keyof typeof PLACEHOLDER_IMAGES;

export function getPlaceholder(type: PlaceholderType): string {
  return PLACEHOLDER_IMAGES[type];
}
