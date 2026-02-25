import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Test, ExtendedActor } from '../lib/actorTypes';

interface TestCardProps {
  test: Test;
}

export default function TestCard({ test }: TestCardProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [score, setScore] = useState('');
  const [showScoreInput, setShowScoreInput] = useState(false);

  const scoreMutation = useMutation({
    mutationFn: async (scoredMarks: bigint) => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      const updatedTest: Test = {
        ...test,
        scoredMarks,
        isCompleted: true,
      };
      await extActor.addTest(updatedTest);
    },
    onSuccess: (_, scoredMarks) => {
      queryClient.invalidateQueries({ queryKey: ['completedTests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingTests'] });
      queryClient.invalidateQueries({ queryKey: ['allTests'] });
      const pct = test.totalMarks > 0n ? Math.round((Number(scoredMarks) / Number(test.totalMarks)) * 100) : 0;
      const xp = pct >= 80 ? 50 : pct >= 60 ? 30 : 10;
      toast.success(`✅ Test scored! +${xp} XP`);
      setShowScoreInput(false);
    },
    onError: () => {
      toast.error('Failed to save score');
    },
  });

  const handleScoreSubmit = () => {
    const s = parseInt(score);
    if (isNaN(s) || s < 0 || s > Number(test.totalMarks)) {
      toast.error(`Score must be between 0 and ${Number(test.totalMarks)}`);
      return;
    }
    scoreMutation.mutate(BigInt(s));
  };

  const pct = test.scoredMarks !== undefined && test.totalMarks > 0n
    ? Math.round((Number(test.scoredMarks) / Number(test.totalMarks)) * 100)
    : null;

  const emoji = pct === null ? '📝' : pct >= 80 ? '🔥' : pct >= 60 ? '👍' : '📚';

  return (
    <div className="rounded-lg border border-border/40 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{emoji}</span>
          <div>
            <p className="text-xs font-medium">{test.name}</p>
            <p className="text-xs text-muted-foreground">{test.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {test.isCompleted ? (
            <Badge variant="secondary" className="text-xs h-5 bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              {pct}%
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs h-5">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          )}
        </div>
      </div>

      {!test.isCompleted && (
        <div>
          {showScoreInput ? (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder={`Score / ${Number(test.totalMarks)}`}
                className="h-7 text-xs flex-1"
                min="0"
                max={Number(test.totalMarks).toString()}
              />
              <Button
                size="sm"
                className="h-7 text-xs px-2"
                onClick={handleScoreSubmit}
                disabled={scoreMutation.isPending}
              >
                {scoreMutation.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs px-2"
                onClick={() => setShowScoreInput(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs w-full"
              onClick={() => setShowScoreInput(true)}
            >
              Enter Score
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
