import { RotateCcw, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { Timer } from './Timer';
import type { Theme } from '../types/game';

interface ControlPanelProps {
  mazeSize: number;
  onMazeSizeChange: (size: number) => void;
  fogMode: boolean;
  onFogModeChange: (enabled: boolean) => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  showPath: boolean;
  onToggleHint: () => void;
  onReset: () => void;
  elapsedTime: number;
  bestTime: number | null;
  isComplete: boolean;
  theme: Theme;
}

export const ControlPanel = ({
  mazeSize,
  onMazeSizeChange,
  fogMode,
  onFogModeChange,
  currentTheme,
  onThemeChange,
  showPath,
  onToggleHint,
  onReset,
  elapsedTime,
  bestTime,
  isComplete,
  theme,
}: ControlPanelProps) => {
  return (
    <div
      className="p-6 rounded-xl backdrop-blur-md space-y-6"
      style={{
        background: 'rgba(0, 0, 0, 0.7)',
        border: `1px solid ${theme.wallColor}30`,
        boxShadow: `0 0 40px ${theme.wallGlow}15`,
      }}
    >
      <div className="text-center">
        <h1
          className="text-2xl font-bold tracking-wider mb-1"
          style={{
            color: theme.accentColor,
            textShadow: `0 0 20px ${theme.accentColor}80`,
            fontFamily: "'Press Start 2P', monospace",
          }}
        >
          迷宫逃脱
        </h1>
        <p className="text-gray-500 text-xs">MAZE ESCAPE</p>
      </div>

      <Timer elapsedTime={elapsedTime} bestTime={bestTime} accentColor={theme.accentColor} />

      {isComplete && (
        <div
          className="p-4 rounded-lg text-center animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${theme.accentColor}20, transparent)`,
            border: `1px solid ${theme.accentColor}50`,
          }}
        >
          <div
            className="text-xl font-bold mb-1"
            style={{
              color: theme.playerColor,
              textShadow: `0 0 15px ${theme.playerGlow}`,
              fontFamily: "'Press Start 2P', monospace",
            }}
          >
            🎉 恭喜通关！
          </div>
          <p className="text-gray-400 text-sm">成功逃离迷宫！</p>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-gray-400 text-sm flex justify-between">
          <span>迷宫尺寸</span>
          <span style={{ color: theme.accentColor }}>{mazeSize} x {mazeSize}</span>
        </label>
        <input
          type="range"
          min="10"
          max="30"
          value={mazeSize}
          onChange={(e) => onMazeSizeChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${theme.accentColor} 0%, ${theme.accentColor} ${((mazeSize - 10) / 20) * 100}%, #333 ${((mazeSize - 10) / 20) * 100}%, #333 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-600">
          <span>10</span>
          <span>30</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-gray-400 text-sm">游戏模式</label>
        <button
          onClick={() => onFogModeChange(!fogMode)}
          className={`w-full p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${
            fogMode ? 'scale-105' : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            background: fogMode ? `${theme.accentColor}20` : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${fogMode ? theme.accentColor : 'transparent'}`,
            boxShadow: fogMode ? `0 0 20px ${theme.accentColor}40` : 'none',
          }}
        >
          <div className="flex items-center gap-2">
            {fogMode ? <EyeOff size={18} style={{ color: theme.accentColor }} /> : <Eye size={18} className="text-gray-400" />}
            <span className={fogMode ? '' : 'text-gray-400'} style={{ color: fogMode ? theme.accentColor : undefined }}>
              迷雾模式
            </span>
          </div>
          <div
            className={`w-10 h-5 rounded-full transition-all duration-300`}
            style={{ background: fogMode ? theme.accentColor : '#444' }}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform duration-300`}
              style={{ transform: fogMode ? 'translateX(20px)' : 'translateX(2px)' }}
            />
          </div>
        </button>
      </div>

      <ThemeSelector currentTheme={currentTheme} onThemeChange={onThemeChange} />

      <div className="flex gap-3">
        <button
          onClick={onToggleHint}
          className={`flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            showPath ? 'scale-105' : 'hover:scale-105'
          }`}
          style={{
            background: showPath ? `${theme.pathColor}20` : 'rgba(255, 255, 255, 0.05)',
            border: `2px solid ${showPath ? theme.pathColor : 'transparent'}`,
            boxShadow: showPath ? `0 0 20px ${theme.pathColor}40` : 'none',
            color: showPath ? theme.pathColor : '#999',
          }}
        >
          <Lightbulb size={18} />
          <span className="text-sm">{showPath ? '隐藏提示' : '路径提示'}</span>
        </button>
        <button
          onClick={onReset}
          className="flex-1 p-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: `2px solid transparent`,
            color: theme.wallColor,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.wallColor;
            e.currentTarget.style.boxShadow = `0 0 20px ${theme.wallGlow}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <RotateCcw size={18} />
          <span className="text-sm">重新开始</span>
        </button>
      </div>

      <div className="pt-4 border-t border-gray-800">
        <p className="text-gray-500 text-xs text-center">
          使用 ↑ ↓ ← → 或 WASD 键控制移动
        </p>
        <p className="text-gray-600 text-xs text-center mt-1">
          也可用鼠标拖拽控制
        </p>
      </div>
    </div>
  );
};
