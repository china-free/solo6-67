import { useGameState } from '../hooks/useGameState';
import { getThemeByName } from '../themes/themes';
import { Game } from '../components/Game';
import { ControlPanel } from '../components/ControlPanel';

export default function Home() {
  const {
    maze,
    mazeSize,
    playerPos,
    startPos,
    endPos,
    isPlaying,
    isComplete,
    elapsedTime,
    bestTime,
    fogMode,
    currentTheme,
    showPath,
    hintPath,
    setMazeSize,
    setFogMode,
    setCurrentTheme,
    toggleHint,
    movePlayer,
    resetGame,
    animationTime,
  } = useGameState(15);

  const theme = getThemeByName(currentTheme);

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative"
      style={{ backgroundColor: theme.background }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${theme.accentColor}30 1px, transparent 1px),
            linear-gradient(90deg, ${theme.accentColor}30 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${theme.background} 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        <div className="flex-1 h-[60vh] lg:h-screen order-2 lg:order-1">
          <Game
            maze={maze}
            playerPos={playerPos}
            startPos={startPos}
            endPos={endPos}
            theme={theme}
            fogMode={fogMode}
            hintPath={hintPath}
            showPath={showPath}
            isComplete={isComplete}
            animationTime={animationTime}
            onMove={movePlayer}
          />
        </div>

        <div className="w-full lg:w-96 p-4 lg:p-6 order-1 lg:order-2 overflow-y-auto">
          <ControlPanel
            mazeSize={mazeSize}
            onMazeSizeChange={setMazeSize}
            fogMode={fogMode}
            onFogModeChange={setFogMode}
            currentTheme={currentTheme}
            onThemeChange={setCurrentTheme}
            showPath={showPath}
            onToggleHint={toggleHint}
            onReset={resetGame}
            elapsedTime={elapsedTime}
            bestTime={bestTime}
            isComplete={isComplete}
            theme={theme}
          />
        </div>
      </div>

      {isComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 animate-pulse" style={{ background: `radial-gradient(circle at center, ${theme.accentColor}20 0%, transparent 60%)` }} />
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${(i * 12 + animationTime * 0.1) % 360}, 100%, 60%)`,
                boxShadow: `0 0 20px hsl(${(i * 12 + animationTime * 0.1) % 360}, 100%, 60%)`,
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
