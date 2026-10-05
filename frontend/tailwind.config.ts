import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            keyframes: {
                'slide-in-up': {
                    '0%': { 
                        transform: 'translateY(100%)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'translateY(0)', 
                        opacity: '0.6' 
                    }
                },
                'slide-in-left': {
                    '0%': { 
                        transform: 'translateX(-100%) skewX(-20deg)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'translateX(0) skewX(-20deg)', 
                        opacity: '0.6' 
                    }
                },
                'text-slide-in-left': {
                    '0%': { 
                        transform: 'translateX(-100%)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'translateX(0)', 
                        opacity: '1' 
                    }
                },
                'slide-in-right': {
                    '0%': { 
                        transform: 'translateX(100%)', 
                        opacity: '0' 
                    },
                    '100%': { 
                        transform: 'translateX(0)', 
                        opacity: '1' 
                    }
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                'hero-shrink': {
                    '0%': { height: '90vh' },
                    '100%': { height: '35vh' }
                }
            },
            animation: {
                'slide-in-up': 'slide-in-up 3.6s ease-out forwards',
                'slide-in-left': 'slide-in-left 3.6s ease-out forwards',
                'text-slide-in-left': 'text-slide-in-left 3.8s ease-out forwards',
                'slide-in-right': 'slide-in-right 2.2s ease-out forwards',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.6s ease-out',
                'slide-down': 'slide-down 0.6s ease-out',
                'slide-up': 'slide-up 0.6s ease-out',
                'hero-shrink': 'hero-shrink 1.2s ease-out forwards'
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                nexafit: {
                    background: '#F3FFB9',
                    navbar: '#F44E1C',
                    footer: '#58355E',
                    green: '#3E6868',
                    accent: '#FC3E57',
                    lightGreen: '#A0E8C5',
                    blue: '#355070'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'ui-sans-serif'],
                'barlow': ['Barlow Condensed', 'sans-serif'],
                'montserrat': ['Montserrat', 'sans-serif'],
                'serif': ['ui-serif', 'Georgia'],
                'mono': ['ui-monospace', 'SFMono-Regular']
            }              
        }
    },
    plugins: [tailwindcssAnimate]
};

export default config;