import { type Subject } from '../backend';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Target, Edit, ChevronRight, Trash2 } from 'lucide-react';
import { EditSubjectDialog } from './EditSubjectDialog';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SubjectCardProps {
  subject: Subject;
  onUpdate: () => void;
}

export function SubjectCard({ subject, onUpdate }: SubjectCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { actor } = useActor();
  
  const completionPercentage = Number(subject.totalTopics) > 0
    ? (Number(subject.completedTopics) / Number(subject.totalTopics)) * 100
    : 0;

  const targetDate = new Date(Number(subject.targetCompletionDate) / 1_000_000);
  const today = new Date();
  const daysRemaining = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const totalDays = Math.ceil(
    (targetDate.getTime() - (today.getTime() - completionPercentage * 24 * 60 * 60 * 1000)) /
      (1000 * 60 * 60 * 24)
  );
  const expectedProgress = totalDays > 0 ? Math.max(0, ((totalDays - daysRemaining) / totalDays) * 100) : 100;

  const isOnTrack = completionPercentage >= expectedProgress - 5;
  const isBehind = completionPercentage < expectedProgress - 5;
  const isOverdue = daysRemaining < 0;

  let statusColor = 'bg-chart-1 text-white';
  let statusText = 'On Track';

  if (isOverdue) {
    statusColor = 'bg-destructive text-destructive-foreground';
    statusText = 'Overdue';
  } else if (isBehind) {
    statusColor = 'bg-chart-4 text-white';
    statusText = 'Behind';
  }

  const handleViewDetails = () => {
    navigate({ to: '/subjects/$subjectName', params: { subjectName: subject.name } });
  };

  const handleDelete = async () => {
    if (!actor) return;
    
    setIsDeleting(true);
    try {
      await actor.deleteSubject(subject.name);
      toast.success('Subject deleted. Chapters moved to archive.');
      setShowDeleteDialog(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error('Failed to delete subject');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden transition-all hover:shadow-web border-2 border-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl">{subject.name}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowEdit(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleViewDetails}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Badge className={`w-fit ${statusColor}`}>{statusText}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold text-primary">{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
            <p className="mt-2 text-xs text-muted-foreground">
              {subject.completedTopics.toString()} of {subject.totalTopics.toString()} topics completed
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{targetDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Target className="h-4 w-4" />
              <span>
                {daysRemaining > 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days overdue`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditSubjectDialog
        subject={subject}
        open={showEdit}
        onOpenChange={setShowEdit}
        onSuccess={() => {
          setShowEdit(false);
          onUpdate();
        }}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{subject.name}" but all its chapters will be moved to the archive where you can still view them. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Subject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
