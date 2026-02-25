import { useNavigate } from '@tanstack/react-router';
import { Plus, BookOpen, Loader2, Brain, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSubjects } from '../hooks/useSubjects';
import { useSeedData } from '../hooks/useSeedData';
import { SubjectCard } from '../components/SubjectCard';
import { AddSubjectDialog } from '../components/AddSubjectDialog';
import { XPLevelCard } from '../components/XPLevelCard';
import { StreakFlameCard } from '../components/StreakFlameCard';
import { TodayGoalCard } from '../components/TodayGoalCard';
import { AISuggester } from '../components/AISuggester';
import { ExamCountdown } from '../components/ExamCountdown';
import { InnerCAVoice } from '../components/InnerCAVoice';

export function Dashboard() {
  const navigate = useNavigate();
  const { subjects, isLoading, isFetched, refetch } = useSubjects();

  // Seed CA Final subjects and chapters if none exist
  const { isSeeding, seedError, retry } = useSeedData();

  const totalSubjects = subjects.length;
  const avgProgress =
    totalSubjects > 0
      ? Math.round(
          subjects.reduce((acc, s) => {
            const total = Number(s.totalTopics);
            const completed = Number(s.completedTopics);
            return acc + (total > 0 ? (completed / total) * 100 : 0);
          }, 0) / totalSubjects
        )
      : 0;

  // Show loading state when: actor is loading, subjects query is loading, or seeding is in progress
  const showLoading = isLoading || isSeeding;
  // Show empty/seeding state when: loaded but no subjects and no error
  const showSeeding = !showLoading && isFetched && subjects.length === 0 && !seedError;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground shadow-web">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-1">CA Final Study Tracker 🕷️</h1>
            <p className="text-primary-foreground/80 text-sm">
              Your journey to becoming a Chartered Accountant starts here.
            </p>
          </div>
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -right-4 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <XPLevelCard />
          <StreakFlameCard />
          <TodayGoalCard />
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {showLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-foreground">{totalSubjects}</div>
                  <p className="text-xs text-muted-foreground mt-1">{avgProgress}% avg progress</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Exam Countdown */}
        <ExamCountdown />

        {/* Inner CA Voice */}
        <InnerCAVoice />

        {/* AI Suggestions */}
        <AISuggester />

        {/* Subjects Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              My Subjects
            </h2>
            <AddSubjectDialog onSuccess={refetch}>
              <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Plus className="h-4 w-4" />
                Add Subject
              </Button>
            </AddSubjectDialog>
          </div>

          {/* Seed error state */}
          {seedError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Setup Failed</AlertTitle>
              <AlertDescription className="flex items-center justify-between gap-4">
                <span>{seedError}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={retry}
                  className="shrink-0 gap-2"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Loading skeletons while actor loads or seeding is in progress */}
          {showLoading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground text-sm mb-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span>{isSeeding ? 'Setting up CA Final subjects and chapters...' : 'Loading subjects...'}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-xl" />
                ))}
              </div>
            </div>
          ) : showSeeding ? (
            /* Subjects fetched but still empty — shouldn't normally happen after seeding */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Subjects Yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-4">
                Add your first subject to get started, or retry the automatic setup.
              </p>
              <Button variant="outline" onClick={retry} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry Setup
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.name}
                  subject={subject}
                  onUpdate={refetch}
                  onClick={() =>
                    navigate({
                      to: '/subjects/$subjectName',
                      params: { subjectName: encodeURIComponent(subject.name) },
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
