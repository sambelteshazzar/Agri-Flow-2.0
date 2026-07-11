export const PLACEHOLDER_IMAGES = {
  crop: '/placeholders/crop-default.svg',
  livestock: '/placeholders/livestock-default.svg',
  news: '/placeholders/news-default.svg',
  marketplace: '/placeholders/marketplace-default.svg',
  user: '/placeholders/user-default.svg',
} as const;

export type PlaceholderType = keyof typeof PLACEHOLDER_IMAGES;

export function getPlaceholder(type: PlaceholderType): string {
  return PLACEHOLDER_IMAGES[type];
}