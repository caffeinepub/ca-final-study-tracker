import { Card, CardContent } from '@/components/ui/card';
import { useUserProgress } from '../hooks/useUserProgress';

function FlameIcon({ streak }: { streak: number }) {
  if (streak === 0) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-3xl select-none">
        🕯️
      </div>
    );
  }

  if (streak <= 3) {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-orange-400/20 to-red-500/20 select-none">
        <span className="text-3xl">🔥</span>
      </div>
    );
  }

  if (streak <= 7) {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-orange-400/30 to-red-600/30 select-none animate-pulse">
        <span className="text-3xl">🔥</span>
        <span className="absolute -top-1 -right-1 text-lg">✨</span>
      </div>
    );
  }

  if (streak <= 14) {
    return (
      <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-yellow-400/40 to-red-600/40 shadow-[0_0_16px_rgba(239,68,68,0.5)] select-none">
        <span className="text-3xl animate-bounce">🔥</span>
        <span className="absolute -top-1 -right-1 text-lg">🔥</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-b from-yellow-300/50 to-red-700/50 shadow-[0_0_24px_rgba(239,68,68,0.7)] select-none">
      <span className="text-3xl animate-bounce">🔥</span>
      <span className="absolute -top-2 -right-2 text-xl animate-pulse">🔥</span>
      <span className="absolute -bottom-1 -left-1 text-base animate-pulse">🔥</span>
    </div>
  );
}

function getStreakLabel(streak: number): string {
  if (streak === 0) return 'No streak yet';
  if (streak === 1) return '1 day streak';
  if (streak <= 3) return `${streak} day streak 🌱`;
  if (streak <= 7) return `${streak} day streak 🔥`;
  if (streak <= 14) return `${streak} day streak 💥`;
  return `${streak} day streak 🌋`;
}

function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Log a session to start your streak!';
  if (streak <= 3) return 'Keep it going!';
  if (streak <= 7) return "You're on fire!";
  if (streak <= 14) return 'Unstoppable! 💪';
  return 'LEGENDARY STREAK! 🏆';
}

export function StreakFlameCard() {
  const { progress: userProgress, isLoading } = useUserProgress();
  const streak = userProgress ? Number(userProgress.currentStreak) : 0;

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 shadow-web">
        <CardContent className="p-5">
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-web overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <FlameIcon streak={streak} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Study Streak</p>
            <p className="text-base font-bold text-foreground leading-tight">{getStreakLabel(streak)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{getStreakMessage(streak)}</p>
          </div>
          {streak >= 15 && (
            <div className="shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary px-3 py-1">
              <span className="text-xs font-bold text-white">BLAZING</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
