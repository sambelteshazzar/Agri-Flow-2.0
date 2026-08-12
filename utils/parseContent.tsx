import { ReactNode } from 'react';

export interface ParsedContent {
  type: 'text' | 'mention' | 'hashtag' | 'url';
  content: string;
  username?: string;
  tag?: string;
  url?: string;
}

export function parseContent(text: string): ParsedContent[] {
  if (!text) return [];
  
  const segments: ParsedContent[] = [];
  let lastIndex = 0;
  
  // Regex to match @mentions, #hashtags, and URLs
  const regex = /(@[\w.]+)|(#[^\s#]+)|(https?:\/\/[^\s]+)/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, mention, hashtag, url] = match;
    const index = match.index;
    
    // Add text before the match
    if (index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, index) });
    }
    
    if (mention) {
      segments.push({ type: 'mention', content: mention, username: mention.slice(1) });
    } else if (hashtag) {
      segments.push({ type: 'hashtag', content: hashtag, tag: hashtag.slice(1) });
    } else if (url) {
      segments.push({ type: 'url', content: url, url });
    }
    
    lastIndex = index + fullMatch.length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }
  
  return segments.length > 0 ? segments : [{ type: 'text', content: text }];
}

export function renderParsedContent(
  segments: ParsedContent[],
  onMentionClick?: (username: string) => void,
  onHashtagClick?: (tag: string) => void,
  onUrlClick?: (url: string) => void
): ReactNode[] {
  return segments.map((segment, index) => {
    switch (segment.type) {
      case 'mention':
        return (
          <span 
            key={index} 
            className="text-jade-600 dark:text-jade-400 hover:underline cursor-pointer"
            onClick={() => onMentionClick?.(segment.username!)}
          >
            {segment.content}
          </span>
        );
      case 'hashtag':
        return (
          <span 
            key={index} 
            className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            onClick={() => onHashtagClick?.(segment.tag!)}
          >
            {segment.content}
          </span>
        );
      case 'url':
        return (
          <a 
            key={index} 
            href={segment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onUrlClick?.(segment.url!);
              window.open(segment.url!, '_blank', 'noopener,noreferrer');
            }}
          >
            {segment.content}
          </a>
        );
      default:
        return <span key={index}>{segment.content}</span>;
    }
  });
}

export function extractMentions(text: string): string[] {
  const mentions = text.match(/@[\w.]+/g);
  return mentions ? mentions.map(m => m.slice(1)) : [];
}

export function extractHashtags(text: string): string[] {
  const hashtags = text.match(/#[^\s#]+/g);
  return hashtags ? hashtags.map(h => h.slice(1)) : [];
}