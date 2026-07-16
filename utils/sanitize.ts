import DOMPurify from 'dompurify';

// Configure DOMPurify for our use case
const purifyConfig = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a', 'span'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  ALLOW_DATA_ATTR: false,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_TRUSTED_TYPE: false,
};

/**
 * Sanitize HTML content to prevent XSS
 * Use for user-generated content that will be rendered with dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, purifyConfig);
}

/**
 * Sanitize plain text (strip all HTML)
 * Use for user input that should never contain HTML
 */
export function sanitizeText(text: string): string {
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

/**
 * Sanitize URL - ensure it's a safe https URL
 */
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '';
    }
    // Block javascript: and data: URLs
    if (parsed.protocol === 'javascript:' || parsed.protocol === 'data:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize user input for display in text content (not HTML)
 * Escapes HTML entities
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}