import '../src/index.css';
import type { Decorator, Preview } from '@storybook/react-vite';
import { themes } from 'storybook/theming';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.light,
    },
    // addon-themes: define selectable themes for toolbar and docs
    themes: {
      clearable: false,
      list: [
        { name: 'light', class: 'light', color: '#ffffff', default: true },
        { name: 'dark', class: 'dark', color: '#0b0f19' },
      ],
    },
  },
  tags: ['autodocs'],
};

export default preview;

// Note: Using the default Docs container to avoid context issues.

// Global theme toolbar (no addon required). Applies Tailwind's `dark`/`light` class to <html>.
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: [
        { value: 'light', title: 'Light' },
        { value: 'dark', title: 'Dark' },
      ],
      showName: true,
      dynamicTitle: true,
    },
  },
};

const applyThemeClass = (theme?: string) => {
  try {
    const saved =
      typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const getEffectiveTheme = (): 'light' | 'dark' => {
      if (theme === 'dark' || theme === 'light') {
        return theme;
      }
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return prefersDark ? 'dark' : 'light';
    };
    const effective = getEffectiveTheme();
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(effective);
  } catch {
    // ignore
  }
};

export const decorators: Decorator[] = [
  (Story, context) => {
    // Sync Tailwind class with addon-themes current theme
    const current = (context.globals as { theme?: string }).theme as
      | 'light'
      | 'dark'
      | undefined;
    applyThemeClass(current);
    return Story();
  },
];
