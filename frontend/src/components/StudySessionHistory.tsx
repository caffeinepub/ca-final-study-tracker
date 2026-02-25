import React from 'react';
import { useStudySessions } from '../hooks/useStudySessions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, BookOpen, AlertCircle } from 'lucide-react';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
}

export default function StudySessionHistory() {
  const { data: sessions, isLoading } = useStudySessions();

  const sorted = sessions ? [...sessions].sort((a, b) => Number(b.date) - Number(a.date)) : [];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">
            No sessions logged yet. Start studying!
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {sorted.map((session, idx) => (
              <div key={idx} className="rounded-lg border border-border/40 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span className="text-xs font-medium">{session.subject}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs h-5">
                      {Number(session.hoursStudied)}h
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(session.date)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{session.topicsCovered}</p>
                {session.errorLog && (
                  <div className="mt-1.5 rounded bg-destructive/10 border border-destructive/20 p-2 flex items-start gap-1.5">
                    <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-destructive-foreground">{session.errorLog}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
