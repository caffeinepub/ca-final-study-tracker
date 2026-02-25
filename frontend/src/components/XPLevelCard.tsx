import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUserProgress } from '../hooks/useUserProgress';
import { Zap, Star } from 'lucide-react';

const LEVEL_THRESHOLDS = [0, 500, 1500, 3500, 7000, 12000, 19000, 28000, 39000];
const LEVEL_NAMES = [
  '', 'Rookie CA', 'Diligent Student', 'Chapter Master',
  'Subject Expert', 'Mock Warrior', 'Revision King',
  'CA Aspirant Elite', 'CA Final Legend', 'Chartered Accountant'
];

function getLevelInfo(xp: number) {
  const level = LEVEL_THRESHOLDS.reduce((lvl, threshold, idx) => xp >= threshold ? idx + 1 : lvl, 1);
  const clampedLevel = Math.min(level, LEVEL_THRESHOLDS.length);
  const currentThreshold = LEVEL_THRESHOLDS[clampedLevel - 1] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[clampedLevel] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpInLevel = xp - currentThreshold;
  const xpNeeded = nextThreshold - currentThreshold;
  const progress = clampedLevel >= LEVEL_THRESHOLDS.length ? 100 : Math.min((xpInLevel / xpNeeded) * 100, 100);
  return { level: clampedLevel, levelName: LEVEL_NAMES[clampedLevel] ?? 'Legend', xpInLevel, xpNeeded, progress, nextThreshold };
}

export function XPLevelCard() {
  const { progress: userProgress, isLoading } = useUserProgress();

  const xp = userProgress ? Number(userProgress.xp) : 0;
  const { level, levelName, xpInLevel, xpNeeded, progress, nextThreshold } = getLevelInfo(xp);

  const levelColors = [
    '', 'from-muted-foreground to-muted-foreground',
    'from-chart-1 to-chart-1', 'from-secondary to-secondary',
    'from-primary to-secondary', 'from-chart-4 to-primary',
    'from-primary to-chart-4', 'from-secondary to-chart-5',
    'from-chart-4 to-secondary', 'from-primary to-chart-4'
  ];
  const gradientClass = levelColors[Math.min(level, levelColors.length - 1)];

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
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-md`}>
            <Star className="h-7 w-7 text-white drop-shadow" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Level {level}</p>
                <p className="text-base font-bold text-foreground leading-tight">{levelName}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-bold text-primary">{xp.toLocaleString()} XP</span>
              </div>
            </div>
            <Progress
              value={progress}
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {level < LEVEL_THRESHOLDS.length
                ? `${xpInLevel} / ${xpNeeded} XP to Level ${level + 1}`
                : '🏆 Maximum Level Reached!'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
