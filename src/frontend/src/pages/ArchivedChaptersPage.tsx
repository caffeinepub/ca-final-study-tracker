import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Archive, Loader2 } from 'lucide-react';
import { useArchivedChapters } from '../hooks/useArchivedChapters';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getTopicEmoji } from '../utils/topicEmojis';

export function ArchivedChaptersPage() {
  const { archivedChapters, isLoading } = useArchivedChapters();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
          <Archive className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Archived Chapters
          </h2>
          <p className="text-muted-foreground mt-1">Chapters from deleted subjects 📦</p>
        </div>
      </div>

      {archivedChapters.length === 0 ? (
        <Alert>
          <AlertDescription>
            No archived chapters. Chapters from deleted subjects will appear here.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {archivedChapters.map((chapter) => {
            const progress = Number(chapter.totalTopics) > 0
              ? (Number(chapter.completedTopics) / Number(chapter.totalTopics)) * 100
              : 0;
            const emoji = getTopicEmoji(chapter.name);

            return (
              <Card key={chapter.name} className="border-2 border-primary/10">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{emoji}</span>
                    <CardTitle className="text-lg">{chapter.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    From: {chapter.subjectName}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" 
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {chapter.completedTopics.toString()} of {chapter.totalTopics.toString()} topics completed
                    </p>
                  </div>
                  {chapter.notesPdf && (
                    <Badge variant="secondary" className="text-xs">
                      📄 Has PDF Notes
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
