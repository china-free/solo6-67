const BEST_TIME_KEY_PREFIX = 'maze_escape_best_time_';

export const getBestTime = (mazeSize: number): number | null => {
  try {
    const key = `${BEST_TIME_KEY_PREFIX}${mazeSize}`;
    const stored = localStorage.getItem(key);
    return stored ? parseFloat(stored) : null;
  } catch {
    return null;
  }
};

export const setBestTime = (mazeSize: number, time: number): void => {
  try {
    const key = `${BEST_TIME_KEY_PREFIX}${mazeSize}`;
    const current = getBestTime(mazeSize);
    if (current === null || time < current) {
      localStorage.setItem(key, time.toString());
    }
  } catch {
    // ignore
  }
};

export const clearBestTime = (mazeSize: number): void => {
  try {
    const key = `${BEST_TIME_KEY_PREFIX}${mazeSize}`;
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

export const clearAllBestTimes = (): void => {
  try {
    for (let i = 10; i <= 30; i++) {
      const key = `${BEST_TIME_KEY_PREFIX}${i}`;
      localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
};
