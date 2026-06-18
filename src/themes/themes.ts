import type { Theme } from '../types/game';

export const themes: Theme[] = [
  {
    name: '赛博朋克',
    background: '#0a0a1a',
    wallColor: '#00f5ff',
    wallGlow: '#00f5ff',
    playerColor: '#39ff14',
    playerGlow: '#39ff14',
    startColor: '#ff00ff',
    endColor: '#ff00ff',
    pathColor: '#ffb000',
    fogColor: 'rgba(10, 10, 26, 0.95)',
    accentColor: '#ff00ff',
  },
  {
    name: '复古像素',
    background: '#1a1a2e',
    wallColor: '#e94560',
    wallGlow: '#e94560',
    playerColor: '#0f3460',
    playerGlow: '#16213e',
    startColor: '#533483',
    endColor: '#533483',
    pathColor: '#f5f5f5',
    fogColor: 'rgba(26, 26, 46, 0.95)',
    accentColor: '#e94560',
  },
  {
    name: '森林绿意',
    background: '#1b4332',
    wallColor: '#95d5b2',
    wallGlow: '#74c69d',
    playerColor: '#ffd60a',
    playerGlow: '#ffc300',
    startColor: '#e63946',
    endColor: '#e63946',
    pathColor: '#d8f3dc',
    fogColor: 'rgba(27, 67, 50, 0.95)',
    accentColor: '#95d5b2',
  },
  {
    name: '深海幽暗',
    background: '#03045e',
    wallColor: '#00b4d8',
    wallGlow: '#0096c7',
    playerColor: '#caf0f8',
    playerGlow: '#ade8f4',
    startColor: '#90e0ef',
    endColor: '#90e0ef',
    pathColor: '#48cae4',
    fogColor: 'rgba(3, 4, 94, 0.95)',
    accentColor: '#00b4d8',
  },
];

export const getThemeByName = (name: string): Theme => {
  return themes.find((t) => t.name === name) || themes[0];
};
