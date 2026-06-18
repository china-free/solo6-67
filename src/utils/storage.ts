const BEST_TIME_KEY = 'maze_escape_best_time';

export const getBestTime = (): number | null => {
  try {
    const stored = localStorage.getItem(BEST_TIME_KEY);
    return stored ? parseFloat(stored) : null;
  } catch {
    return null;
  }
};

export const setBestTime = (time: number): void => {
  try {
    const current = getBestTime();
    if (current === null || time < current) {
      localStorage.setItem(BEST_TIME_KEY, time.toString());
    }
  } catch {
    // ignore
  }
};

export const clearBestTime = (): void => {
  try {
    localStorage.removeItem(BEST_TIME_KEY);
  } catch {
    // ignore
  }
};
