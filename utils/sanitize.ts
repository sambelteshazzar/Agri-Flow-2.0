// HTML sanitization using the browser-native DOMParser API.
// No external dependencies required.

const ALLOWED_TAGS = new Set([
  'B', 'I', 'EM', 'STRONG', 'P', 'BR', 'UL', 'OL', 'LI', 'A',
]);

const ALLOWED_ATTR: Record<string, Set<string>> = {
  A: new Set(['href', 'target', 'rel']),
};

function sanitizeNode(node: Element): void {
  const tag = node.tagName;

  if (!ALLOWED_TAGS.has(tag)) {
    // Replace disallowed element with its text content (escaped)
    const text = document.createTextNode(node.textContent ?? '');
    node.replaceWith(text);
    return;
  }

  // Strip disallowed attributes
  const allowed = ALLOWED_ATTR[tag] ?? new Set<string>();
  for (const attr of Array.from(node.attributes)) {
    if (!allowed.has(attr.name.toLowerCase())) {
      node.removeAttribute(attr.name);
    }
  }

  // For <a> tags, enforce safe href and rel attributes
  if (tag === 'A') {
    const href = node.getAttribute('href') ?? '';
    try {
      const url = new URL(href, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) {
        node.removeAttribute('href');
      } else {
        node.setAttribute('href', url.toString());
      }
    } catch {
      node.removeAttribute('href');
    }
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }

  // Recursively sanitize children
  for (const child of Array.from(node.children)) {
    sanitizeNode(child);
  }
}

export function sanitizeHtml(input: string): string {
  if (!input) return '';
  const doc = new DOMParser().parseFromString(input, 'text/html');
  for (const child of Array.from(doc.body.children)) {
    sanitizeNode(child);
  }
  return doc.body.innerHTML;
}

export function sanitizeText(input: string): string {
  if (!input) return '';
  // Escape all HTML so it displays as text content
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

export function sanitizeUrl(input: string): string {
  try {
    const url = new URL(input, window.location.href);
    if (['http:', 'https:'].includes(url.protocol)) {
      return url.toString();
    }
  } catch {
    // Invalid URL
  }
  return '';
}
