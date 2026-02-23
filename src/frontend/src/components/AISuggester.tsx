import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, Clock, TrendingDown, Loader2, Target, Award } from 'lucide-react';
import { useRevisionSuggestions } from '../hooks/useRevisionSuggestions';
import { useSubjects } from '../hooks/useSubjects';
import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { useCompletedTests } from '../hooks/useCompletedTests';
import { useSuggestedSubjects } from '../hooks/useSuggestedSubjects';

export function AISuggester() {
  const { suggestions, isLoading: suggestionsLoading } = useRevisionSuggestions();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { revisions, isLoading: revisionsLoading } = useRevisionSchedule();
  const { completedTests, isLoading: testsLoading } = useCompletedTests();
  const { suggestedSubjects, isLoading: backendSuggestionsLoading } = useSuggestedSubjects();

  const isLoading = suggestionsLoading || subjectsLoading || revisionsLoading || testsLoading || backendSuggestionsLoading;

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-web">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Study Suggestions 🕷️
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average test scores per subject
  const subjectTestScores = new Map<string, { total: number; count: number }>();
  completedTests.forEach((test) => {
    if (test.scoredMarks && test.totalMarks) {
      const percentage = (Number(test.scoredMarks) / Number(test.totalMarks)) * 100;
      const existing = subjectTestScores.get(test.subject) || { total: 0, count: 0 };
      subjectTestScores.set(test.subject, {
        total: existing.total + percentage,
        count: existing.count + 1,
      });
    }
  });

  // Find subjects with low test scores (< 60%)
  const lowScoreSubjects = Array.from(subjectTestScores.entries())
    .filter(([_, scores]) => scores.total / scores.count < 60)
    .map(([subject, scores]) => ({
      subject,
      avgScore: scores.total / scores.count,
    }))
    .sort((a, b) => a.avgScore - b.avgScore)
    .slice(0, 2);

  // Find subjects with approaching deadlines (within 30 days)
  const now = Date.now();
  const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;
  const urgentSubjects = subjects
    .filter((s) => {
      const targetDate = Number(s.targetCompletionDate) / 1_000_000;
      const progress = (Number(s.completedTopics) / Number(s.totalTopics)) * 100;
      return targetDate >= now && targetDate <= thirtyDaysFromNow && progress < 80;
    })
    .sort((a, b) => Number(a.targetCompletionDate) - Number(b.targetCompletionDate))
    .slice(0, 2);

  // Find subjects with low progress (< 50%)
  const lowProgressSubjects = subjects
    .filter((s) => {
      const progress = (Number(s.completedTopics) / Number(s.totalTopics)) * 100;
      return progress < 50;
    })
    .sort((a, b) => {
      const progressA = (Number(a.completedTopics) / Number(a.totalTopics)) * 100;
      const progressB = (Number(b.completedTopics) / Number(b.totalTopics)) * 100;
      return progressA - progressB;
    })
    .slice(0, 2);

  // Find overdue revisions
  const overdueRevisions = revisions
    .filter((r) => !r.isComplete && Number(r.scheduledDate) / 1_000_000 < now)
    .slice(0, 2);

  // Find upcoming revisions (next 7 days)
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60 * 1000;
  const upcomingRevisions = revisions
    .filter(
      (r) =>
        !r.isComplete &&
        Number(r.scheduledDate) / 1_000_000 >= now &&
        Number(r.scheduledDate) / 1_000_000 <= sevenDaysFromNow
    )
    .slice(0, 2);

  const allSuggestions = [
    ...lowScoreSubjects.map((s) => ({
      type: 'low-score' as const,
      text: `Focus on ${s.subject}`,
      reason: `Low test score: ${s.avgScore.toFixed(0)}%`,
      icon: Award,
      color: 'text-destructive',
    })),
    ...urgentSubjects.map((s) => ({
      type: 'urgent-deadline' as const,
      text: `Prioritize ${s.name}`,
      reason: `Deadline approaching: ${new Date(Number(s.targetCompletionDate) / 1_000_000).toLocaleDateString()}`,
      icon: Target,
      color: 'text-chart-4',
    })),
    ...lowProgressSubjects.map((s) => ({
      type: 'low-progress' as const,
      text: `Focus on ${s.name}`,
      reason: `Low progress: ${((Number(s.completedTopics) / Number(s.totalTopics)) * 100).toFixed(0)}%`,
      icon: TrendingDown,
      color: 'text-chart-4',
    })),
    ...overdueRevisions.map((r) => ({
      type: 'overdue' as const,
      text: `Revise ${r.topic}`,
      reason: `Overdue: ${r.subject}`,
      icon: AlertCircle,
      color: 'text-destructive',
    })),
    ...upcomingRevisions.map((r) => ({
      type: 'upcoming' as const,
      text: `Prepare for ${r.topic}`,
      reason: `Due soon: ${r.subject}`,
      icon: Clock,
      color: 'text-secondary',
    })),
  ];

  // Include backend suggestions
  const backendSuggestionsList = suggestedSubjects
    .filter((s) => s && s.trim() !== '')
    .map((s) => ({
      type: 'backend-suggested' as const,
      text: `Work on ${s}`,
      reason: 'AI recommended',
      icon: Sparkles,
      color: 'text-primary',
    }));

  const combinedSuggestions = [...allSuggestions, ...backendSuggestionsList].slice(0, 6);

  if (combinedSuggestions.length === 0) {
    return (
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-web">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Study Suggestions 🕷️
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-muted-foreground">Great job! You're on track with all your subjects. 🎉</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-web">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Study Suggestions 🕷️
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {combinedSuggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 rounded-lg border-2 border-border bg-card/50 p-3 transition-all hover:bg-card hover:border-primary/30"
              >
                <Icon className={`h-5 w-5 mt-0.5 ${suggestion.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{suggestion.text}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {suggestion.reason}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
