import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RevisionScheduleProps {
  onUpdate: () => void;
}

export function RevisionSchedule({ onUpdate }: RevisionScheduleProps) {
  const { actor } = useActor();
  const { revisions, isLoading, error } = useRevisionSchedule();

  const handleMarkComplete = async (subject: string, topic: string) => {
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    try {
      await actor.markRevisionComplete(subject, topic);
      toast.success('Revision marked as complete');
      onUpdate();
    } catch (error) {
      console.error('Error marking revision complete:', error);
      toast.error('Failed to mark revision as complete');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revision Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revision Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load revision schedule</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedRevisions = [...revisions].sort((a, b) => Number(a.scheduledDate - b.scheduledDate));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingRevisions = sortedRevisions.filter((r) => {
    const revDate = new Date(Number(r.scheduledDate) / 1_000_000);
    revDate.setHours(0, 0, 0, 0);
    return !r.isComplete && revDate >= today;
  });

  const overdueRevisions = sortedRevisions.filter((r) => {
    const revDate = new Date(Number(r.scheduledDate) / 1_000_000);
    revDate.setHours(0, 0, 0, 0);
    return !r.isComplete && revDate < today;
  });

  const completedRevisions = sortedRevisions.filter((r) => r.isComplete);

  return (
    <div className="space-y-6">
      {overdueRevisions.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Overdue Revisions ({overdueRevisions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overdueRevisions.map((revision, index) => {
                const date = new Date(Number(revision.scheduledDate) / 1_000_000);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4"
                  >
                    <Checkbox
                      checked={revision.isComplete}
                      onCheckedChange={() => handleMarkComplete(revision.subject, revision.topic)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline" className="border-destructive text-destructive">
                          {revision.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium">{revision.topic}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Revisions ({upcomingRevisions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingRevisions.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Calendar className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No upcoming revisions scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingRevisions.map((revision, index) => {
                const date = new Date(Number(revision.scheduledDate) / 1_000_000);
                return (
                  <div key={index} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <Checkbox
                      checked={revision.isComplete}
                      onCheckedChange={() => handleMarkComplete(revision.subject, revision.topic)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline">{revision.subject}</Badge>
                        <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium">{revision.topic}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {completedRevisions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Revisions ({completedRevisions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedRevisions.map((revision, index) => {
                const date = new Date(Number(revision.scheduledDate) / 1_000_000);
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4 opacity-60"
                  >
                    <Checkbox checked={true} disabled className="mt-1" />
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="outline">{revision.subject}</Badge>
                        <span className="text-xs text-muted-foreground">{date.toLocaleDateString()}</span>
                      </div>
                      <p className="font-medium line-through">{revision.topic}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
