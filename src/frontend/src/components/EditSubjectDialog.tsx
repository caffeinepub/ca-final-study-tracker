import { type Subject } from '../backend';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SubjectForm } from './SubjectForm';

interface EditSubjectDialogProps {
  subject: Subject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditSubjectDialog({ subject, open, onOpenChange, onSuccess }: EditSubjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
        </DialogHeader>
        <SubjectForm subject={subject} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
