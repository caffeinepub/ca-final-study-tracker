import { useStudySessions } from '../hooks/useStudySessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function StudySessionHistory() {
  const { sessions, isLoading, error } = useStudySessions();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Study History</CardTitle>
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
          <CardTitle>Study History</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>Failed to load study sessions</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const sortedSessions = [...sessions].sort((a, b) => Number(b.date - a.date));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study History</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedSessions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <BookOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
            <p>No study sessions logged yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedSessions.map((session, index) => {
              const date = new Date(Number(session.date) / 1_000_000);
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="outline">{session.subject}</Badge>
                    <span className="text-sm text-muted-foreground">{date.toLocaleDateString()}</span>
                  </div>
                  <p className="mb-2 text-sm">{session.topicsCovered}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{session.hoursStudied.toString()} hours</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
