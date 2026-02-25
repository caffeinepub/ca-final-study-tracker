import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { ExtendedActor } from '../lib/actorTypes';
import { useTodayGoal } from '../hooks/useTodayGoal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function TodayGoalCard() {
  const { actor } = useActor();
  const { goal, isLoading, refetch } = useTodayGoal();
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  const dailyGoal = goal ? Number(goal.dailyGoal) : 0;
  const actual = goal ? Number(goal.actual) : 0;
  const progress = dailyGoal > 0 ? Math.min((actual / dailyGoal) * 100, 100) : 0;

  const handleSetGoal = async () => {
    if (!actor || newGoal <= 0) return;
    setIsUpdating(true);
    try {
      await (actor as unknown as ExtendedActor).setTodayGoal(BigInt(newGoal));
      toast.success('Daily goal set!');
      setIsSettingGoal(false);
      refetch();
    } catch (error) {
      console.error('Error setting goal:', error);
      toast.error('Failed to set goal');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = async () => {
    if (!actor) return;
    setIsUpdating(true);
    try {
      await (actor as unknown as ExtendedActor).incrementTodayGoal();
      toast.success('Progress updated! +1 hour');
      refetch();
    } catch (error) {
      console.error('Error incrementing goal:', error);
      toast.error('Failed to update progress');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-web">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="h-5 w-5 text-primary" />
          Today's Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {dailyGoal > 0 ? (
          <>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">
                  {actual}h / {dailyGoal}h
                </span>
              </div>
              <Progress
                value={progress}
                className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 gap-1"
                onClick={handleIncrement}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                +1 Hour
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsSettingGoal(true)}
                disabled={isUpdating}
              >
                Edit
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">No goal set for today</p>
        )}

        {(isSettingGoal || dailyGoal === 0) && (
          <div className="flex gap-2">
            <Input
              type="number"
              min="1"
              max="24"
              value={newGoal || ''}
              onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
              placeholder="Hours"
              className="h-8 text-sm"
              disabled={isUpdating}
            />
            <Button size="sm" onClick={handleSetGoal} disabled={isUpdating || newGoal <= 0}>
              {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Set'}
            </Button>
            {isSettingGoal && (
              <Button size="sm" variant="ghost" onClick={() => setIsSettingGoal(false)}>
                Cancel
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
