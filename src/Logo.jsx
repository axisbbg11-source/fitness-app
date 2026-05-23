import React from 'react';

export default function Logo({ size = 56, color = '#78E6FF', bg = 'rgba(255,255,255,0.04)' }) {
  const s = typeof size === 'number' ? `${size}px` : size;

  return (
    <div className="flex justify-center mb-5">
      <div className="relative">
        <div className="rounded-2xl flex items-center justify-center" style={{ width: s, height: s, background: bg, border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg width={Math.round(parseInt(s) * 0.8)} height={Math.round(parseInt(s) * 0.8)} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FitCoach logo">
            <rect width="512" height="512" rx="28" fill="#070617" />
            <g transform="translate(256 256)">
              <g transform="rotate(-28)">
                <path d="M-120 -8 C-100 -8 -92 -24 -72 -24" stroke={color} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.98" />
                <path d="M120 8 C100 8 92 24 72 24" stroke={color} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.98" />
                <path d="M-92 -20 L-40 -20 L-4 -44 L4 -44 L40 -20 L92 -20" stroke={color} strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <g transform="translate(-150 6)">
                  <rect x="-6" y="-28" width="34" height="56" rx="8" fill={color} opacity="0.07"/>
                  <path d="M-6 -28 h34" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M-6 28 h34" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <g transform="translate(116 6)">
                  <rect x="-6" y="-28" width="34" height="56" rx="8" fill={color} opacity="0.07"/>
                  <path d="M-6 -28 h34" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M-6 28 h34" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
                <path d="M-168 0 C-150 -28 -120 -46 -80 -46 L-24 -46 C-8 -46 8 -46 24 -46 L80 -46 C120 -46 150 -28 168 0" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
