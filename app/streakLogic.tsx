let streakCount = 0;

export const getStreakCount = () => {
  return streakCount;
};

export const updateStreakCount = () => {
  streakCount += 1;
};

export const resetStreakCount = () => {
  streakCount = 0;
};
