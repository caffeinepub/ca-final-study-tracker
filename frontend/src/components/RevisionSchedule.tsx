import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { ExtendedActor } from '../lib/actorTypes';
import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface RevisionScheduleProps {
  onUpdate?: () => void;
}

export function RevisionSchedule({ onUpdate }: RevisionScheduleProps) {
  const { actor } = useActor();
  const { revisions, isLoading, refetch } = useRevisionSchedule();
  const [completing, setCompleting] = useState<string | null>(null);

  const now = Date.now();

  const handleComplete = async (subject: string, topic: string) => {
    if (!actor) return;
    const key = `${subject}-${topic}`;
    setCompleting(key);
    try {
      await (actor as unknown as ExtendedActor).markRevisionComplete(subject, topic);
      toast.success(`Marked "${topic}" as complete`);
      refetch();
      onUpdate?.();
    } catch (error) {
      console.error('Error marking revision complete:', error);
      toast.error('Failed to mark revision as complete');
    } finally {
      setCompleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const overdue = revisions.filter((r) => !r.isComplete && Number(r.scheduledDate) / 1_000_000 < now);
  const upcoming = revisions.filter(
    (r) => !r.isComplete && Number(r.scheduledDate) / 1_000_000 >= now
  );
  const completed = revisions.filter((r) => r.isComplete);

  if (revisions.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-8 text-center text-muted-foreground">
          No revision topics scheduled yet. Add your first revision topic to get started.
        </CardContent>
      </Card>
    );
  }

  const RevisionItem = ({
    subject,
    topic,
    scheduledDate,
    isComplete,
  }: {
    subject: string;
    topic: string;
    scheduledDate: bigint;
    isComplete: boolean;
  }) => {
    const key = `${subject}-${topic}`;
    const date = new Date(Number(scheduledDate) / 1_000_000);
    const isCompleting = completing === key;

    return (
      <div className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3">
        <Checkbox
          checked={isComplete}
          disabled={isComplete || isCompleting}
          onCheckedChange={() => !isComplete && handleComplete(subject, topic)}
          className="mt-0.5"
        />
        {isCompleting && <Loader2 className="h-4 w-4 animate-spin text-primary mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
            {topic}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {subject}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {date.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <Card className="border-2 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive text-base">
              <AlertCircle className="h-4 w-4" />
              Overdue ({overdue.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdue.map((r) => (
              <RevisionItem key={`${r.subject}-${r.topic}`} {...r} />
            ))}
          </CardContent>
        </Card>
      )}

      {upcoming.length > 0 && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Upcoming ({upcoming.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((r) => (
              <RevisionItem key={`${r.subject}-${r.topic}`} {...r} />
            ))}
          </CardContent>
        </Card>
      )}

      {completed.length > 0 && (
        <Card className="border-2 border-chart-1/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-chart-1 text-base">
              <CheckCircle2 className="h-4 w-4" />
              Completed ({completed.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {completed.map((r) => (
              <RevisionItem key={`${r.subject}-${r.topic}`} {...r} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
