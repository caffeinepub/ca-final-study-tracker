import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import type { Chapter } from '../lib/actorTypes';
import { useInvalidateUserProgress } from '../hooks/useUserProgress';
import { useInvalidateChapters } from '../hooks/useChapters';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, BookOpen, Pencil, Check, X, CheckCircle2 } from 'lucide-react';
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
  const invalidateChapters = useInvalidateChapters();
  const queryClient = useQueryClient();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(chapter.chapterName);
  const [isSavingName, setIsSavingName] = useState(false);

  const [isCompleted, setIsCompleted] = useState(chapter.isCompleted);
  const [isTogglingCompletion, setIsTogglingCompletion] = useState(false);

  const [showPdfUploader, setShowPdfUploader] = useState(false);

  const hasPdf = chapter.notesPdf && chapter.notesPdf.length > 0;
  const emoji = getTopicEmoji(chapter.chapterName);

  const handleSaveName = async () => {
    if (!actor) return;
    const trimmed = editedName.trim();
    if (!trimmed) {
      toast.error('Chapter name cannot be empty');
      return;
    }
    if (trimmed === chapter.chapterName) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      await actor.updateChapterName(chapter.chapterId, trimmed);
      await queryClient.invalidateQueries({ queryKey: ['chapters'] });
      invalidateChapters();
      toast.success('Chapter name updated ✏️');
      setIsEditingName(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating chapter name:', error);
      toast.error('Failed to update chapter name');
    } finally {
      setIsSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(chapter.chapterName);
    setIsEditingName(false);
  };

  const handleToggleCompletion = async (checked: boolean) => {
    if (!actor) return;
    setIsTogglingCompletion(true);
    const prev = isCompleted;
    setIsCompleted(checked);
    try {
      await actor.updateChapterCompletion(chapter.chapterId, checked);
      await queryClient.invalidateQueries({ queryKey: ['chapters'] });
      invalidateChapters();
      await invalidateUserProgress();
      toast.success(checked ? 'Chapter marked as completed! 🎉' : 'Chapter marked as incomplete');
      onUpdate();
    } catch (error) {
      console.error('Error updating chapter completion:', error);
      setIsCompleted(prev);
      toast.error('Failed to update chapter completion');
    } finally {
      setIsTogglingCompletion(false);
    }
  };

  return (
    <Card
      className={`border-2 transition-all ${
        isCompleted
          ? 'border-green-500/50 bg-green-500/5 dark:bg-green-500/10'
          : 'border-border hover:border-primary/30'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <span className="text-xl mt-0.5 shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="h-7 text-sm font-semibold"
                    disabled={isSavingName}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveName();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0 text-green-600 hover:text-green-700"
                    onClick={handleSaveName}
                    disabled={isSavingName}
                  >
                    {isSavingName ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                    onClick={handleCancelEdit}
                    disabled={isSavingName}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group">
                  <p
                    className={`text-sm font-semibold leading-tight truncate ${
                      isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {chapter.chapterName}
                  </p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setEditedName(chapter.chapterName);
                      setIsEditingName(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isCompleted && (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
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
        <div
          className={`flex items-center justify-between rounded-lg px-3 py-2 ${
            isCompleted
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-muted/50 border border-border'
          }`}
        >
          <Label
            htmlFor={`complete-${chapter.chapterId}`}
            className={`text-sm font-medium cursor-pointer select-none ${
              isCompleted ? 'text-green-700 dark:text-green-400' : 'text-foreground'
            }`}
          >
            {isCompleted ? '✅ Completed' : 'Mark as Completed'}
          </Label>
          <div className="flex items-center gap-2">
            {isTogglingCompletion && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
            <Switch
              id={`complete-${chapter.chapterId}`}
              checked={isCompleted}
              onCheckedChange={handleToggleCompletion}
              disabled={isTogglingCompletion}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasPdf ? (
            <PdfViewer chapterId={chapter.chapterId} chapterName={chapter.chapterName} />
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
            chapterId={chapter.chapterId}
            chapterName={chapter.chapterName}
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
