import React from 'react';
import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedActor } from '../lib/actorTypes';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function RevisionSchedule() {
  const { data: topics, isLoading } = useRevisionSchedule();
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: async ({ subject, topic }: { subject: string; topic: string }) => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      await extActor.markRevisionComplete(subject, topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisionTopics'] });
      toast.success('Revision marked as complete!');
    },
    onError: () => {
      toast.error('Failed to mark revision complete');
    },
  });

  const now = Date.now() * 1_000_000;
  const overdue = topics?.filter((t) => !t.isComplete && Number(t.scheduledDate) < now) ?? [];
  const upcoming = topics?.filter((t) => !t.isComplete && Number(t.scheduledDate) >= now) ?? [];
  const completed = topics?.filter((t) => t.isComplete) ?? [];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Revision Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : (topics?.length ?? 0) === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No revision topics scheduled yet.
          </p>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {overdue.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-destructive mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </p>
                {overdue.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 p-2 mb-1.5">
                    <div>
                      <p className="text-xs font-medium">{t.topic}</p>
                      <p className="text-xs text-muted-foreground">{t.subject} · {formatDate(t.scheduledDate)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                      onClick={() => completeMutation.mutate({ subject: t.subject, topic: t.topic })}
                      disabled={completeMutation.isPending}
                    >
                      Done
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {upcoming.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Upcoming
                </p>
                {upcoming.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border/40 p-2 mb-1.5">
                    <div>
                      <p className="text-xs font-medium">{t.topic}</p>
                      <p className="text-xs text-muted-foreground">{t.subject} · {formatDate(t.scheduledDate)}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs px-2"
                      onClick={() => completeMutation.mutate({ subject: t.subject, topic: t.topic })}
                      disabled={completeMutation.isPending}
                    >
                      Done
                    </Button>
                  </div>
                ))}
              </div>
            )}
            {completed.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-green-600 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </p>
                {completed.map((t, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 p-2 mb-1.5 opacity-60">
                    <div>
                      <p className="text-xs font-medium line-through">{t.topic}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs h-5 bg-green-500/10 text-green-600">
                      ✓
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
