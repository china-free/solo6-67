import { themes } from '../themes/themes';
import type { Theme } from '../types/game';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-gray-400 text-sm">主题风格</label>
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme: Theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`p-2 rounded-lg text-sm transition-all duration-300 ${
              currentTheme === theme.name
                ? 'scale-105'
                : 'hover:scale-102 opacity-70 hover:opacity-100'
            }`}
            style={{
              background: theme.background,
              border: `2px solid ${currentTheme === theme.name ? theme.accentColor : 'transparent'}`,
              boxShadow: currentTheme === theme.name ? `0 0 15px ${theme.accentColor}60` : 'none',
              color: theme.wallColor,
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: theme.playerColor, boxShadow: `0 0 8px ${theme.playerGlow}` }}
              />
              <span className="text-xs">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
