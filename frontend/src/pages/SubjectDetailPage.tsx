import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookOpen, CheckCircle2, Clock, BookMarked, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useChapters } from '../hooks/useChapters';
import { useSubjects } from '../hooks/useSubjects';
import { ChapterCard } from '../components/ChapterCard';
import { AddChapterDialog } from '../components/AddChapterDialog';
import type { Chapter } from '../lib/actorTypes';

export function SubjectDetailPage() {
  const params = useParams({ strict: false }) as { subjectName?: string };
  const navigate = useNavigate();

  const subjectName = params.subjectName ? decodeURIComponent(params.subjectName) : '';

  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: rawChapters = [], isLoading: chaptersLoading } = useChapters(subjectName);

  // Normalise the notesPdf field: backend returns `Uint8Array | undefined`,
  // but ChapterCard expects the Motoko-style `[] | [Uint8Array]` tuple.
  const chapters: Chapter[] = rawChapters.map((c) => ({
    name: c.name,
    subjectName: c.subjectName,
    totalTopics: c.totalTopics,
    completedTopics: c.completedTopics,
    notesPdf: c.notesPdf ? [c.notesPdf as Uint8Array] : [],
  }));

  const subject = subjects.find((s) => s.name === subjectName);

  const completedChapters = chapters.filter(
    (c) => Number(c.completedTopics) > 0 && Number(c.completedTopics) >= Number(c.totalTopics)
  );
  const progressPercent =
    chapters.length > 0 ? Math.round((completedChapters.length / chapters.length) * 100) : 0;

  const isLoading = subjectsLoading || chaptersLoading;
  const isPaper4 = subjectName.includes('Paper 4');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate({ to: '/' })}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Subject Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">
                    {subjectName || 'Subject'}
                  </h1>
                  {subject && (
                    <p className="text-sm text-muted-foreground">
                      {Number(subject.completedTopics)} / {Number(subject.totalTopics)} topics completed
                    </p>
                  )}
                </div>
                {!isPaper4 && (
                  <AddChapterDialog subjectName={subjectName} onSuccess={() => {}}>
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                      Add Chapter
                    </Button>
                  </AddChapterDialog>
                )}
              </div>

              {/* Progress bar — only when chapters exist */}
              {chapters.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Chapter Progress</span>
                    <span className="font-medium text-primary">{progressPercent}%</span>
                  </div>
                  <Progress
                    value={progressPercent}
                    className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
                  />
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      {completedChapters.length} completed
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-yellow-500" />
                      {chapters.length - completedChapters.length} remaining
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Chapters Grid or Empty State */}
            {chapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                  <BookMarked className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  {isPaper4 ? 'Chapters Coming Soon' : 'No Chapters Yet'}
                </h2>
                <p className="text-muted-foreground max-w-sm mb-6">
                  {isPaper4
                    ? 'Chapters for this paper will be added once the syllabus is updated. Check back soon!'
                    : 'No chapters have been added for this subject yet. Add your first chapter to get started.'}
                </p>
                {!isPaper4 && (
                  <AddChapterDialog subjectName={subjectName} onSuccess={() => {}}>
                    <Button variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Your First Chapter
                    </Button>
                  </AddChapterDialog>
                )}
                <div className="mt-4">
                  <Badge variant="outline" className="text-xs">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {isPaper4 ? 'Syllabus pending' : '0 chapters'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                  <ChapterCard key={chapter.name} chapter={chapter} onUpdate={() => {}} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
