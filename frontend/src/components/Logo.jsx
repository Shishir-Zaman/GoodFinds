import React from 'react';

const Logo = ({ size = 40 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background circle with gradient */}
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
            </defs>

            {/* Shopping bag shape */}
            <rect x="15" y="25" width="70" height="60" rx="8" fill="url(#logoGradient)" />
            <path d="M 30 25 L 30 20 Q 30 10 50 10 Q 70 10 70 20 L 70 25"
                stroke="url(#logoGradient)"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round" />

            {/* GF Text */}
            <text x="50" y="65"
                fontFamily="Arial, sans-serif"
                fontSize="36"
                fontWeight="bold"
                fill="white"
                textAnchor="middle">
                GF
            </text>
        </svg>
    );
};

export default Logo;
