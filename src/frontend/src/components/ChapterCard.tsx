import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Loader2, FileText } from 'lucide-react';
import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { PdfViewer } from './PdfViewer';

interface Chapter {
  name: string;
  subjectName: string;
  totalTopics: bigint;
  completedTopics: bigint;
  notesPdf: Uint8Array | null;
}

interface ChapterCardProps {
  chapter: Chapter;
  onUpdate: () => void;
}

export function ChapterCard({ chapter, onUpdate }: ChapterCardProps) {
  const { actor } = useActor();
  const [completedTopics, setCompletedTopics] = useState(Number(chapter.completedTopics));
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const totalTopics = Number(chapter.totalTopics);
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  const handleUpdate = async () => {
    if (!actor) return;

    if (completedTopics > totalTopics) {
      toast.error('Completed topics cannot exceed total topics');
      return;
    }

    setIsUpdating(true);
    try {
      await actor.updateChapterTopics(chapter.name, BigInt(completedTopics));
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
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5" />
            {chapter.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`completed-${chapter.name}`}>Completed Topics</Label>
            <div className="flex gap-2">
              <Input
                id={`completed-${chapter.name}`}
                type="number"
                min="0"
                max={totalTopics}
                value={completedTopics}
                onChange={(e) => setCompletedTopics(parseInt(e.target.value) || 0)}
                disabled={isUpdating}
              />
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Out of {totalTopics} total topics</p>
          </div>

          {chapter.notesPdf && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setShowPdfViewer(true)}
            >
              <FileText className="h-4 w-4" />
              View Notes
            </Button>
          )}
        </CardContent>
      </Card>

      {showPdfViewer && (
        <PdfViewer
          chapterName={chapter.name}
          open={showPdfViewer}
          onOpenChange={setShowPdfViewer}
        />
      )}
    </>
  );
}
