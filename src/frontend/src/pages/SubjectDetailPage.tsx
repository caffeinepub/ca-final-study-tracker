import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { useChapters } from '../hooks/useChapters';
import { ChapterCard } from '../components/ChapterCard';
import { AddChapterDialog } from '../components/AddChapterDialog';
import { PdfUploader } from '../components/PdfUploader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export function SubjectDetailPage() {
  const { subjectName } = useParams({ from: '/subjects/$subjectName' });
  const navigate = useNavigate();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { chapters, isLoading: chaptersLoading, refetch } = useChapters(subjectName);

  const subject = subjects.find((s) => s.name === subjectName);

  if (subjectsLoading || chaptersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subject details...</p>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Subject Not Found</AlertTitle>
        <AlertDescription>The subject you're looking for doesn't exist.</AlertDescription>
      </Alert>
    );
  }

  const completionPercentage = Number(subject.totalTopics) > 0
    ? (Number(subject.completedTopics) / Number(subject.totalTopics)) * 100
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight">{subject.name}</h2>
          <p className="text-muted-foreground mt-1">Chapter-wise progress tracking</p>
        </div>
        <AddChapterDialog subjectName={subjectName} onSuccess={refetch}>
          <Button className="gap-2">
            <Plus className="h-5 w-5" />
            Add Chapter
          </Button>
        </AddChapterDialog>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Overall Subject Progress</h3>
            <span className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {subject.completedTopics.toString()} of {subject.totalTopics.toString()} topics completed
          </p>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Plus className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No chapters yet</h3>
            <p className="text-muted-foreground mb-6">
              Break down this subject into chapters to track your progress in detail.
            </p>
            <AddChapterDialog subjectName={subjectName} onSuccess={refetch}>
              <Button size="lg" className="gap-2">
                <Plus className="h-5 w-5" />
                Add First Chapter
              </Button>
            </AddChapterDialog>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <ChapterCard key={chapter.name} chapter={chapter} onUpdate={refetch} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Upload Study Notes (PDF)</h3>
        <PdfUploader />
      </div>
    </div>
  );
}
