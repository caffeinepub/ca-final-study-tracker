import React from 'react';
import { useRevisionSuggestions } from '../hooks/useRevisionSuggestions';
import { useSuggestedSubjects } from '../hooks/useSuggestedSubjects';
import { useCompletedTests } from '../hooks/useCompletedTests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, BookOpen, Calendar } from 'lucide-react';

export default function AISuggester() {
  const { data: revisionSuggestions, isLoading: revLoading } = useRevisionSuggestions();
  const { data: suggestedSubjects, isLoading: subLoading } = useSuggestedSubjects();
  const { data: completedTests } = useCompletedTests();

  const lowScoreSubjects = completedTests
    ?.filter((t) => t.scoredMarks !== undefined && t.totalMarks > 0n)
    .filter((t) => (Number(t.scoredMarks!) / Number(t.totalMarks)) * 100 < 60)
    .map((t) => t.subject)
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3) ?? [];

  const isLoading = revLoading || subLoading;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Study Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-6 rounded" />)}
          </div>
        ) : (
          <>
            {lowScoreSubjects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-destructive mb-1.5">Needs Attention</p>
                <div className="flex flex-wrap gap-1.5">
                  {lowScoreSubjects.map((s) => (
                    <Badge key={s} variant="destructive" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {revisionSuggestions && revisionSuggestions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Overdue Revisions</p>
                <div className="space-y-1">
                  {revisionSuggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary flex-shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {suggestedSubjects && suggestedSubjects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">Focus Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedSubjects.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {lowScoreSubjects.length === 0 &&
              (!revisionSuggestions || revisionSuggestions.length === 0) &&
              (!suggestedSubjects || suggestedSubjects.length === 0) && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Keep studying to get personalized suggestions!
                </p>
              )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
