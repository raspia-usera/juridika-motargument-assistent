
import type { Config } from "tailwindcss";

export default {
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
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
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
                juridika: {
                    charcoal: '#1a1a1a',       // Deep ebony
                    gray: '#4a4a4a',           // Dark gray
                    midgray: '#6a6a6a',        // Medium gray
                    lightgray: '#a8a39a',      // Light warm gray
                    gold: '#8b6914',           // Deep gold
                    softgold: '#f5f2ed',       // Soft gold background
                    background: '#faf8f5',     // Warm background
                    wood: '#8b4513',           // Rich wood tone
                },
                // Enhanced wood-inspired color palette
                ebony: {
                    50: '#faf8f5',
                    100: '#f5f2ed',
                    200: '#ede7dc',
                    300: '#d0ccc5',
                    400: '#a8a39a',
                    500: '#6a6a6a',
                    600: '#4a4a4a',
                    700: '#2d2d2d',
                    800: '#1a1a1a',
                    900: '#0a0a0a',
                },
                gold: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#8b6914',
                    600: '#b8860b',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                wood: {
                    50: '#faf8f5',
                    100: '#f5f1ea',
                    200: '#e8ddc7',
                    300: '#d4c4a0',
                    400: '#cd853f',
                    500: '#8b4513',
                    600: '#a0522d',
                    700: '#8b4513',
                    800: '#654321',
                    900: '#4a2c17',
                }
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
                'fade-in': {
                    '0%': { 
                        opacity: '0',
                        transform: 'translateY(15px)'
                    },
                    '100%': { 
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                },
                'subtle-glow': {
                    '0%, 100%': { 
                        filter: 'drop-shadow(0 3px 6px rgba(139, 105, 20, 0.3))'
                    },
                    '50%': { 
                        filter: 'drop-shadow(0 4px 8px rgba(139, 105, 20, 0.5))'
                    }
                },
                'slide-up': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)'
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)'
                    }
                }
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.4s ease-out',
                'subtle-glow': 'subtle-glow 3s ease-in-out infinite',
                'slide-up': 'slide-up 0.5s ease-out',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
