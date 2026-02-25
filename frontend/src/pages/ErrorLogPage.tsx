import React from 'react';
import { useErrorLogs } from '../hooks/useErrorLogs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, BookOpen, Clock, Calendar } from 'lucide-react';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ErrorLogPage() {
  const { data: errorSessions, isLoading } = useErrorLogs();

  const sorted = errorSessions
    ? [...errorSessions].sort((a, b) => Number(b.date) - Number(a.date))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-destructive" />
          Error Log
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review mistakes and areas that need more attention
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No error logs yet. Great job staying on track!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((session, idx) => (
            <Card key={idx} className="border-destructive/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {session.subject}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(session.date)}
                    <Clock className="h-3 w-3 ml-1" />
                    {Number(session.hoursStudied)}h
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{session.topicsCovered}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-destructive-foreground">{session.errorLog}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
