import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, RotateCcw, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useTodayGoal } from '../hooks/useTodayGoal';
import { toast } from 'sonner';

export function TodayGoalCard() {
  const { actor } = useActor();
  const { goal, isLoading, refetch } = useTodayGoal();
  const [newGoal, setNewGoal] = useState(0);
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [isIncrementing, setIsIncrementing] = useState(false);

  const dailyGoal = Number(goal?.dailyGoal || 0);
  const actual = Number(goal?.actual || 0);
  const progress = dailyGoal > 0 ? (actual / dailyGoal) * 100 : 0;

  const handleSetGoal = async () => {
    if (!actor || newGoal <= 0) {
      toast.error('Please enter a valid goal');
      return;
    }

    setIsSettingGoal(true);
    try {
      await actor.setTodayGoal(BigInt(newGoal));
      toast.success('Daily goal set!');
      setNewGoal(0);
      refetch();
    } catch (error) {
      console.error('Error setting goal:', error);
      toast.error('Failed to set goal');
    } finally {
      setIsSettingGoal(false);
    }
  };

  const handleIncrement = async () => {
    if (!actor) return;

    setIsIncrementing(true);
    try {
      await actor.incrementTodayGoal();
      toast.success('Progress updated! 🎯');
      refetch();
    } catch (error) {
      console.error('Error incrementing goal:', error);
      toast.error('Failed to update progress');
    } finally {
      setIsIncrementing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-secondary/5 shadow-web">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Today's Study Goal 🎯
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dailyGoal === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Set your daily study goal (topics to complete)</p>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={newGoal || ''}
                onChange={(e) => setNewGoal(parseInt(e.target.value) || 0)}
                placeholder="e.g., 5"
                disabled={isSettingGoal}
              />
              <Button onClick={handleSetGoal} disabled={isSettingGoal} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                {isSettingGoal ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Set Goal'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">
                  {actual} / {dailyGoal} topics
                </span>
              </div>
              <Progress value={progress} className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleIncrement}
                disabled={isIncrementing || actual >= dailyGoal}
                className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isIncrementing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Complete Topic
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setNewGoal(0);
                  handleSetGoal();
                }}
                disabled={isSettingGoal}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
