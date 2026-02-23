import { type Test } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import { getTopicEmoji } from '../utils/topicEmojis';

interface TestCardProps {
  test: Test;
  onUpdate: () => void;
}

export function TestCard({ test, onUpdate }: TestCardProps) {
  const { actor } = useActor();
  const [scoredMarks, setScoredMarks] = useState(test.scoredMarks ? Number(test.scoredMarks) : 0);
  const [isUpdating, setIsUpdating] = useState(false);

  const totalMarks = Number(test.totalMarks);
  const currentScore = test.scoredMarks ? Number(test.scoredMarks) : 0;
  const percentage = totalMarks > 0 ? (currentScore / totalMarks) * 100 : 0;

  let progressColor = '[&>div]:bg-gradient-to-r [&>div]:from-chart-1 [&>div]:to-chart-1';
  if (percentage < 50) progressColor = '[&>div]:bg-gradient-to-r [&>div]:from-destructive [&>div]:to-destructive';
  else if (percentage < 75) progressColor = '[&>div]:bg-gradient-to-r [&>div]:from-chart-4 [&>div]:to-chart-4';

  const testDate = new Date(Number(test.date) / 1_000_000);
  const emoji = getTopicEmoji(test.subject);

  const handleUpdateScore = async () => {
    if (!actor) return;

    if (scoredMarks > totalMarks) {
      toast.error('Scored marks cannot exceed total marks');
      return;
    }

    setIsUpdating(true);
    try {
      await actor.updateTestScore(test.name, BigInt(scoredMarks));
      toast.success('Test score updated');
      onUpdate();
    } catch (error) {
      console.error('Error updating test score:', error);
      toast.error('Failed to update test score');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="border-2 border-primary/10 hover:border-primary/30 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{test.name}</CardTitle>
          <Badge variant={test.isCompleted ? 'default' : 'outline'} className={test.isCompleted ? 'bg-gradient-to-r from-primary to-secondary' : ''}>
            {test.isCompleted ? 'Completed' : 'Pending'}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-lg">{emoji}</span>
          <BookOpen className="h-4 w-4" />
          <span>{test.subject}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{testDate.toLocaleDateString()}</span>
        </div>

        {test.chapters.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {test.chapters.map((chapter, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {chapter}
              </Badge>
            ))}
          </div>
        )}

        {test.isCompleted ? (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Score</span>
              <span className="font-semibold">
                {currentScore} / {totalMarks} ({percentage.toFixed(0)}%)
              </span>
            </div>
            <Progress value={percentage} className={`h-2 ${progressColor}`} />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`score-${test.name}`}>Enter Score</Label>
            <div className="flex gap-2">
              <Input
                id={`score-${test.name}`}
                type="number"
                min="0"
                max={totalMarks}
                value={scoredMarks || ''}
                onChange={(e) => setScoredMarks(parseInt(e.target.value) || 0)}
                placeholder={`Out of ${totalMarks}`}
                disabled={isUpdating}
              />
              <Button onClick={handleUpdateScore} disabled={isUpdating} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
