import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useTodayGoal } from '../hooks/useTodayGoal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedActor } from '../lib/actorTypes';

export default function TodayGoalCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: goal } = useTodayGoal();
  const [goalInput, setGoalInput] = useState('');
  const [showInput, setShowInput] = useState(false);

  const setGoalMutation = useMutation({
    mutationFn: async (hours: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      await extActor.setTodayGoal(hours);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayGoal'] });
      setGoalInput('');
      setShowInput(false);
      toast.success('Daily goal set!');
    },
    onError: () => toast.error('Failed to set goal'),
  });

  const incrementMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      await extActor.incrementTodayHours(1n);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayGoal'] });
      toast.success('+1 hour logged!');
    },
    onError: () => toast.error('Failed to increment hours'),
  });

  const dailyGoal = goal ? Number(goal.dailyGoal) : 0;
  const actual = goal ? Number(goal.actual) : 0;
  const progress = dailyGoal > 0 ? Math.min(100, Math.round((actual / dailyGoal) * 100)) : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Today's Goal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{actual}h / {dailyGoal}h</span>
          <span className="font-bold text-primary">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex gap-2">
          {showInput ? (
            <>
              <Input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Hours"
                className="h-7 text-xs flex-1"
                min="1"
              />
              <Button
                size="sm"
                className="h-7 text-xs px-2"
                onClick={() => setGoalMutation.mutate(BigInt(goalInput || '0'))}
                disabled={setGoalMutation.isPending}
              >
                {setGoalMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Set'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1"
                onClick={() => setShowInput(true)}
              >
                Set Goal
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs"
                onClick={() => incrementMutation.mutate()}
                disabled={incrementMutation.isPending}
              >
                {incrementMutation.isPending ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Plus className="h-3 w-3" />
                )}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
