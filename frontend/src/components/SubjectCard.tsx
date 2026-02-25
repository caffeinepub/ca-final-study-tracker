import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import type { Subject, ExtendedActor } from '../lib/actorTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2, Pencil, Eye, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getTopicEmoji } from '../utils/topicEmojis';
import { EditSubjectDialog } from './EditSubjectDialog';

interface SubjectCardProps {
  subject: Subject;
  onUpdate: () => void;
  /** Optional click handler for the View button; defaults to navigating to /subjects/$subjectName */
  onClick?: () => void;
}

export function SubjectCard({ subject, onUpdate, onClick }: SubjectCardProps) {
  const { actor } = useActor();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const total = Number(subject.totalTopics);
  const completed = Number(subject.completedTopics);
  const progress = total > 0 ? (completed / total) * 100 : 0;
  const emoji = getTopicEmoji(subject.name);
  const targetDate = new Date(Number(subject.targetCompletionDate) / 1_000_000);
  const isCompleted = completed >= total && total > 0;
  const isOverdue = targetDate < new Date() && !isCompleted;

  const handleView = () => {
    if (onClick) {
      onClick();
    } else {
      navigate({
        to: '/subjects/$subjectName',
        params: { subjectName: encodeURIComponent(subject.name) },
      });
    }
  };

  const handleDelete = async () => {
    if (!actor) return;
    setIsDeleting(true);
    try {
      await (actor as unknown as ExtendedActor).deleteSubject(subject.name);
      toast.success(`${subject.name} deleted`);
      onUpdate();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all shadow-web group">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-2xl">{emoji}</span>
            <CardTitle className="text-base leading-tight truncate">{subject.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {isCompleted && (
              <Badge className="bg-chart-1/20 text-chart-1 border-chart-1/30 text-xs">Done ✓</Badge>
            )}
            {isOverdue && !isCompleted && (
              <Badge variant="destructive" className="text-xs">
                Overdue
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
            className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {subject.completedTopics.toString()} / {subject.totalTopics.toString()} topics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Target: {targetDate.toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1 text-xs"
            onClick={handleView}
          >
            <Eye className="h-3 w-3" />
            View
          </Button>

          <EditSubjectDialog subject={subject} onSuccess={onUpdate}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          </EditSubjectDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs text-destructive hover:text-destructive"
                disabled={isDeleting}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {subject.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete the subject and archive all its chapters. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
