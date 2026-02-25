import React from 'react';
import { useParams } from '@tanstack/react-router';
import { useChapters, useInvalidateChapters } from '../hooks/useChapters';
import { ChapterCard } from '../components/ChapterCard';
import { AddChapterDialog } from '../components/AddChapterDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, BookOpen, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function SubjectDetailPage() {
  const { subjectName } = useParams({ from: '/subject/$subjectName' });
  const decodedName = decodeURIComponent(subjectName);
  const navigate = useNavigate();
  const invalidateChapters = useInvalidateChapters();

  const { data: chapters, isLoading } = useChapters(decodedName);

  const completedCount = chapters?.filter((c) => c.isCompleted).length ?? 0;
  const totalCount = chapters?.length ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/' })}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-black tracking-tight">{decodedName}</h1>
            <Badge variant="secondary" className="text-xs">
              {completedCount} / {totalCount} completed
            </Badge>
          </div>
          {totalCount > 0 && (
            <div className="mt-2 max-w-md">
              <Progress value={progressPercent} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{progressPercent}% complete</p>
            </div>
          )}
        </div>
        <AddChapterDialog subjectName={decodedName} onSuccess={invalidateChapters}>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Chapter
          </Button>
        </AddChapterDialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !chapters || chapters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No chapters yet. Add your first chapter!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.chapterId}
              chapter={chapter}
              onUpdate={invalidateChapters}
            />
          ))}
        </div>
      )}
    </div>
  );
}
