/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sci-fi': ['Orbitron', 'sans-serif'],
                'content': ['Rajdhani', 'sans-serif'],
            },
            colors: {
                'void-dark': '#0f172a',
                'holo-blue': '#0ea5e9',
                'gold-dust': '#fbbf24',
                'u-damascus': '#b45309',
                'u-cordoba': '#15803d',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(100px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.8s ease-out forwards',
                'shimmer': 'shimmer 2s linear infinite',
            }
        }
    },
    plugins: [],
}
