import React from 'react';

export interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
  bgColor?: string;
  textColor?: string;
}

const hueMap: Record<string, number> = {
  a: 140, b: 280, c: 20, d: 260, e: 50, f: 320,
  g: 160, h: 20, i: 220, j: 340, k: 180, l: 300,
  m: 60, n: 100, o: 240, p: 20, q: 120, r: 15,
  s: 200, t: 280, u: 30, v: 190, w: 10, x: 250,
  y: 80, z: 330,
};

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getAvatarColors(name: string): { bg: string; text: string } {
  const firstLetter = name.trim().toLowerCase()[0] || 'a';
  const hue = hueMap[firstLetter] || (hashString(name) % 360);
  return {
    bg: `hsl(${hue} 55% 45%)`,
    text: '#ffffff',
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 40,
  className = '',
  bgColor,
  textColor,
}) => {
  const initials = getInitials(name);
  const { bg, text } = bgColor && textColor ? { bg: bgColor, text: textColor } : getAvatarColors(name);
  const fontSize = Math.max(10, size * 0.35);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={name}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={bg} />
      <text
        x={size / 2}
        y={size / 2 + fontSize / 2.8}
        textAnchor="middle"
        dominantBaseline="central"
        fill={text}
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};

export default Avatar;