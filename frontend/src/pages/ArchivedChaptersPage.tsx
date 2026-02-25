import React from 'react';
import { useArchivedChapters } from '../hooks/useArchivedChapters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Archive, CheckCircle2, BookOpen } from 'lucide-react';

export default function ArchivedChaptersPage() {
  const { data: archivedChapters, isLoading } = useArchivedChapters();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Archive className="h-6 w-6 text-primary" />
          Archived Chapters
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          All completed chapters across your subjects
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !archivedChapters || archivedChapters.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Archive className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No completed chapters yet. Keep studying!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {archivedChapters.map((chapter) => (
            <Card
              key={chapter.chapterId}
              className="border-green-500/30 bg-green-500/5"
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium line-through text-muted-foreground">
                        {chapter.chapterName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {chapter.subjectName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    ✓ Completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
