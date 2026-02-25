import { useState } from 'react';
import type { Subject } from '../lib/actorTypes';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubjectForm } from './SubjectForm';

interface EditSubjectDialogProps {
  subject: Subject;
  onSuccess: () => void;
  children: React.ReactNode;
}

export function EditSubjectDialog({ subject, onSuccess, children }: EditSubjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Progress — {subject.name}</DialogTitle>
        </DialogHeader>
        <SubjectForm
          subject={subject}
          onSuccess={() => {
            setOpen(false);
            onSuccess();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
