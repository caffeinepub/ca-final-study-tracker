import { SubjectCard } from '../components/SubjectCard';
import { AddSubjectDialog } from '../components/AddSubjectDialog';
import { TodayGoalCard } from '../components/TodayGoalCard';
import { AISuggester } from '../components/AISuggester';
import { useSubjects } from '../hooks/useSubjects';
import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Dashboard() {
  const { subjects, isLoading, error, refetch } = useSubjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failed to load subjects. Please try again.</AlertDescription>
      </Alert>
    );
  }

  const totalSubjects = subjects.length;
  const completedSubjects = subjects.filter((s) => s.completedTopics >= s.totalTopics).length;
  const averageProgress =
    totalSubjects > 0
      ? subjects.reduce((acc, s) => acc + (Number(s.completedTopics) / Number(s.totalTopics)) * 100, 0) /
        totalSubjects
      : 0;

  return (
    <div className="space-y-8">
      {/* Spider-Man Logo Section */}
      <div className="flex items-center justify-center">
        <div className="relative">
          <img 
            src="/assets/generated/spiderman-logo.dim_200x200.png" 
            alt="Spider-Man Logo" 
            className="h-32 w-32 object-contain animate-pulse"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Subject Overview
          </h2>
          <p className="text-muted-foreground mt-1">Track your progress across all CA Final subjects 🎯</p>
        </div>
        <AddSubjectDialog onSuccess={refetch}>
          <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
            <Plus className="h-5 w-5" />
            Add Subject
          </Button>
        </AddSubjectDialog>
      </div>

      <TodayGoalCard />

      <AISuggester />

      {totalSubjects > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-web">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-primary">{averageProgress.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-2 border-secondary/20 bg-card p-6 shadow-web">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 text-secondary">
                <span className="text-xl font-bold">{totalSubjects}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Subjects</p>
                <p className="text-2xl font-bold text-secondary">{totalSubjects}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-2 border-chart-1/20 bg-card p-6 shadow-web">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10 text-chart-1">
                <span className="text-xl font-bold">{completedSubjects}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-chart-1">{completedSubjects}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-primary/30 bg-muted/30 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No subjects yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by adding your first CA Final subject to track your preparation progress. 🚀
            </p>
            <AddSubjectDialog onSuccess={refetch}>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                <Plus className="h-5 w-5" />
                Add Your First Subject
              </Button>
            </AddSubjectDialog>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.name} subject={subject} onUpdate={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
