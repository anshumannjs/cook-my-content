import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {

            // ─── Colors ────────────────────────────────────────────────────────────
            colors: {
                // Base
                primary: '#0A0A0A',   // near-black background
                shadow: '#1C1612',   // warm dark card surface

                // Cream family — from near-white to warm parchment
                cream: {
                    50: '#FDFAF5',
                    100: '#FAF4E8',
                    200: '#F5EDD8',
                    300: '#EDE4CA',
                    DEFAULT: '#F5F0E8', // offwhite — primary text
                },

                // Gold family — pale champagne to deep antique
                gold: {
                    50: '#F7E8CA',
                    100: '#F0D4A0',
                    200: '#E6C39B',   // gold-light
                    DEFAULT: '#D4A574', // primary gold
                    dark: '#B08354',
                    800: '#8C6235',
                },

                // Amber / Orange family — warm energy accent
                amber: {
                    300: '#E8A854',
                    400: '#D4874A',
                    500: '#C4703A',
                    600: '#A85A28',
                },
            },

            // ─── Typography ────────────────────────────────────────────────────────
            fontFamily: {
                heading: ['var(--font-heading)', 'Cormorant Garamond', 'serif'],
                body: ['var(--font-body)', 'Inter', 'sans-serif'],
            },

            // ─── Background images ─────────────────────────────────────────────────
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'radial-gradient(circle at 50% 50%, rgba(212,165,116,0.15) 0%, rgba(10,10,10,0) 60%)',
                'gold-shimmer': 'linear-gradient(105deg, transparent 40%, rgba(212,165,116,0.15) 50%, transparent 60%)',
                'cream-fade': 'linear-gradient(to bottom, #0A0A0A, #1A1208)',
                'gold-gradient': 'linear-gradient(135deg, #D4A574, #E6C39B)',
                'amber-gradient': 'linear-gradient(135deg, #D4874A, #E8A854)',
            },

            // ─── Animations ────────────────────────────────────────────────────────
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
                'spin-slow': 'spin 8s linear infinite',
                'fade-up': 'fadeUp 0.6s ease forwards',
                'fade-in': 'fadeIn 0.5s ease forwards',
                'count-up': 'countUp 1s ease forwards',
                'draw-line': 'drawLine 1.2s ease forwards',
                'glow-pulse': 'glowPulse 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                drawLine: {
                    '0%': { strokeDashoffset: '1000' },
                    '100%': { strokeDashoffset: '0' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212,165,116,0.2)' },
                    '50%': { boxShadow: '0 0 40px rgba(212,165,116,0.5)' },
                },
            },

            // ─── Box shadows ───────────────────────────────────────────────────────
            boxShadow: {
                'gold-sm': '0 0 15px rgba(212,165,116,0.15)',
                'gold-md': '0 0 30px rgba(212,165,116,0.25)',
                'gold-lg': '0 0 60px rgba(212,165,116,0.35)',
                'gold-xl': '0 0 100px rgba(212,165,116,0.4)',
                'amber-md': '0 0 30px rgba(212,135,74,0.3)',
                'card': '0 20px 60px rgba(28,22,18,0.5)',
                'card-hover': '0 32px 80px rgba(28,22,18,0.7)',
                'inset-gold': 'inset 0 1px 0 rgba(212,165,116,0.15)',
            },

            // ─── Border radius ─────────────────────────────────────────────────────
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },

            // ─── Backdrop blur ─────────────────────────────────────────────────────
            backdropBlur: {
                xs: '2px',
            },

            // ─── Spacing extras ────────────────────────────────────────────────────
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '88': '22rem',
                '112': '28rem',
                '128': '32rem',
            },

            // ─── Z-index ───────────────────────────────────────────────────────────
            zIndex: {
                '60': '60',
                '70': '70',
                '80': '80',
                '90': '90',
                '100': '100',
            },
        },
    },
    plugins: [],
}

export default config