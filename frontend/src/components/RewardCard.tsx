import type { Reward } from '../lib/actorTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Lock, Unlock, Star } from 'lucide-react';

interface RewardCardProps {
  reward: Reward;
}

export function RewardCard({ reward }: RewardCardProps) {
  const progress =
    reward.progress.length > 0 && reward.target.length > 0
      ? Math.min((Number(reward.progress[0]) / Number(reward.target[0])) * 100, 100)
      : reward.isUnlocked
      ? 100
      : 0;

  const unlockDate =
    reward.unlockDate.length > 0
      ? new Date(Number(reward.unlockDate[0]) / 1_000_000).toLocaleDateString()
      : null;

  return (
    <Card
      className={`border-2 transition-all ${
        reward.isUnlocked
          ? 'border-chart-1/40 bg-gradient-to-br from-card to-chart-1/5 shadow-web'
          : 'border-border opacity-75'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {reward.isUnlocked ? (
              <Unlock className="h-5 w-5 text-chart-1" />
            ) : (
              <Lock className="h-5 w-5 text-muted-foreground" />
            )}
            <CardTitle className="text-base">{reward.name}</CardTitle>
          </div>
          <Badge
            variant={reward.isUnlocked ? 'default' : 'outline'}
            className={reward.isUnlocked ? 'bg-chart-1/20 text-chart-1 border-chart-1/30' : ''}
          >
            {reward.isUnlocked ? '✓ Unlocked' : 'Locked'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{reward.description}</p>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{reward.unlockCondition}</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <Progress
            value={progress}
            className={`h-1.5 ${
              reward.isUnlocked
                ? '[&>div]:bg-gradient-to-r [&>div]:from-chart-1 [&>div]:to-chart-2'
                : '[&>div]:bg-muted-foreground'
            }`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3 w-3 text-chart-4" />
            <span>+{reward.bonusXp.toString()} Bonus XP</span>
          </div>
          {unlockDate && (
            <span className="text-xs text-chart-1">🎉 Unlocked {unlockDate}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
