import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111513',
        paper: '#f4f2eb',
        signal: '#c8f169',
        ember: '#ff704f',
        mist: '#9aa39b',
        panel: '#1c231f',
        line: '#334039',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        signal: '0 0 0 1px rgba(200,241,105,.32), 0 18px 60px rgba(200,241,105,.08)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(200,241,105,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,105,.055) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};

export default config;
