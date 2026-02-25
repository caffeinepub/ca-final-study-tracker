import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { Test, ExtendedActor } from '../lib/actorTypes';
import { useInvalidateUserProgress } from '../hooks/useUserProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';

interface TestCardProps {
  test: Test;
  onUpdate: () => void;
}

export function TestCard({ test, onUpdate }: TestCardProps) {
  const { actor } = useActor();
  const invalidateUserProgress = useInvalidateUserProgress();
  const [isUpdating, setIsUpdating] = useState(false);
  const [scoredMarks, setScoredMarks] = useState(
    test.scoredMarks.length > 0 ? Number(test.scoredMarks[0]) : 0
  );

  const percentage =
    test.scoredMarks.length > 0
      ? (Number(test.scoredMarks[0]) / Number(test.totalMarks)) * 100
      : null;

  const testDate = new Date(Number(test.date) / 1_000_000);

  const getScoreEmoji = (pct: number) => {
    if (pct >= 90) return '🏆';
    if (pct >= 75) return '🌟';
    if (pct >= 60) return '✅';
    if (pct >= 40) return '📚';
    return '💪';
  };

  const handleUpdateScore = async () => {
    if (!actor) return;
    setIsUpdating(true);
    try {
      const xpResponse = await (actor as unknown as ExtendedActor).updateTestScore(
        test.name,
        BigInt(scoredMarks)
      );
      await invalidateUserProgress();
      const xpGained = Math.round((scoredMarks / Number(test.totalMarks)) * 50);
      toast.success(
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span>
            Score updated! <strong>+{xpGained} XP</strong> earned
            {xpResponse && ` · Level ${Number(xpResponse.level)}`}
          </span>
        </div>
      );
      onUpdate();
    } catch (error) {
      console.error('Error updating test score:', error);
      toast.error('Failed to update test score');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-2 border-border hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm leading-tight">{test.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{testDate.toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Badge variant="outline" className="text-xs">
              {test.subject}
            </Badge>
            {percentage !== null && (
              <span className="text-lg">{getScoreEmoji(percentage)}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {percentage !== null ? (
          <div className="text-center py-2">
            <p className="text-2xl font-bold text-primary">{percentage.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {test.scoredMarks[0]?.toString()} / {test.totalMarks.toString()} marks
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Enter your score:</p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max={Number(test.totalMarks)}
                value={scoredMarks || ''}
                onChange={(e) => setScoredMarks(parseInt(e.target.value) || 0)}
                className="h-8 text-sm"
                placeholder={`0 - ${test.totalMarks.toString()}`}
                disabled={isUpdating}
              />
              <Button size="sm" onClick={handleUpdateScore} disabled={isUpdating} className="shrink-0">
                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        )}

        {test.chapters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {test.chapters.map((ch) => (
              <Badge key={ch} variant="secondary" className="text-xs">
                {ch}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
