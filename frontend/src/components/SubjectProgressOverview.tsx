import { useSubjects } from '../hooks/useSubjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Loader2 } from 'lucide-react';
import { getTopicEmoji } from '../utils/topicEmojis';

export function SubjectProgressOverview() {
  const { subjects, isLoading } = useSubjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!subjects || subjects.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-8 text-center text-muted-foreground">
          No subjects added yet. Add subjects from the Dashboard to see progress here.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-web">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          All Subjects
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const emoji = getTopicEmoji(subject.name);
            const totalChapters = Number(subject.totalChapters);

            return (
              <div
                key={subject.name}
                className="rounded-lg border-2 border-border bg-card/50 p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <h4 className="font-semibold text-sm flex-1 truncate">{subject.name}</h4>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 text-primary" />
                  <span>
                    <span className="font-semibold text-foreground">{totalChapters}</span> chapters
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
