import { Trophy, Clock } from 'lucide-react';

interface TimerProps {
  elapsedTime: number;
  bestTime: number | null;
  accentColor: string;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const ms = Math.floor((time % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

export const Timer = ({ elapsedTime, bestTime, accentColor }: TimerProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Clock size={20} style={{ color: accentColor }} />
        <span className="text-gray-400 text-sm">当前时间</span>
      </div>
      <div
        className="text-4xl font-mono font-bold tracking-wider"
        style={{
          color: accentColor,
          textShadow: `0 0 20px ${accentColor}`,
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        {formatTime(elapsedTime)}
      </div>
      {bestTime !== null && (
        <div className="flex items-center gap-2 mt-2">
          <Trophy size={18} className="text-yellow-400" />
          <span className="text-gray-400 text-sm">最佳记录:</span>
          <span
            className="text-yellow-400 font-mono text-lg"
            style={{ textShadow: '0 0 10px rgba(250, 204, 21, 0.5)' }}
          >
            {formatTime(bestTime)}
          </span>
        </div>
      )}
    </div>
  );
};
