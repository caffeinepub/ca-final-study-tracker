import { useSubjects } from '../hooks/useSubjects';
import { Progress } from '@/components/ui/progress';
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

  if (subjects.length === 0) {
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
          All Subjects Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const progress = Number(subject.totalTopics) > 0
              ? (Number(subject.completedTopics) / Number(subject.totalTopics)) * 100
              : 0;
            const emoji = getTopicEmoji(subject.name);
            const targetDate = new Date(Number(subject.targetCompletionDate) / 1_000_000);

            return (
              <div
                key={subject.name}
                className="rounded-lg border-2 border-border bg-card/50 p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{emoji}</span>
                  <h4 className="font-semibold text-sm flex-1">{subject.name}</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-semibold text-primary">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={progress} 
                    className="h-1.5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" 
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{subject.completedTopics.toString()} / {subject.totalTopics.toString()} topics</span>
                    <span>Due: {targetDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
