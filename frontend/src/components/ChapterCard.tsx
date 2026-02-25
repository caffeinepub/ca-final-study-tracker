import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { Chapter, ExtendedActor } from '../lib/actorTypes';
import { useInvalidateUserProgress } from '../hooks/useUserProgress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, BookOpen } from 'lucide-react';
import { PdfUploader } from './PdfUploader';
import { PdfViewer } from './PdfViewer';
import { getTopicEmoji } from '../utils/topicEmojis';

interface ChapterCardProps {
  chapter: Chapter;
  onUpdate: () => void;
}

export function ChapterCard({ chapter, onUpdate }: ChapterCardProps) {
  const { actor } = useActor();
  const invalidateUserProgress = useInvalidateUserProgress();
  const [isUpdating, setIsUpdating] = useState(false);
  const [completedTopics, setCompletedTopics] = useState(Number(chapter.completedTopics));
  const [showPdfUploader, setShowPdfUploader] = useState(false);

  const total = Number(chapter.totalTopics);
  const progress = total > 0 ? (completedTopics / total) * 100 : 0;
  const emoji = getTopicEmoji(chapter.name);
  const hasPdf = chapter.notesPdf && chapter.notesPdf.length > 0;

  const handleUpdate = async () => {
    if (!actor) return;
    setIsUpdating(true);
    try {
      await (actor as unknown as ExtendedActor).updateChapterTopics(chapter.name, BigInt(completedTopics));
      await invalidateUserProgress();
      toast.success('Chapter progress updated');
      onUpdate();
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast.error('Failed to update chapter');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-2 border-border hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-xl">{emoji}</span>
            <CardTitle className="text-sm leading-tight truncate">{chapter.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {hasPdf && (
              <Badge variant="outline" className="text-xs gap-1">
                <BookOpen className="h-3 w-3" />
                Notes
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
          </div>
          <Progress
            value={progress}
            className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
          />
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            max={total}
            value={completedTopics}
            onChange={(e) => setCompletedTopics(parseInt(e.target.value) || 0)}
            className="h-8 text-sm"
            disabled={isUpdating}
          />
          <span className="text-sm text-muted-foreground whitespace-nowrap">/ {total}</span>
          <Button size="sm" onClick={handleUpdate} disabled={isUpdating} className="shrink-0">
            {isUpdating ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {hasPdf ? (
            <PdfViewer chapterName={chapter.name} />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setShowPdfUploader(!showPdfUploader)}
            >
              {showPdfUploader ? 'Cancel' : '+ Add Notes'}
            </Button>
          )}
        </div>

        {showPdfUploader && (
          <PdfUploader
            chapterName={chapter.name}
            onSuccess={() => {
              setShowPdfUploader(false);
              onUpdate();
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
