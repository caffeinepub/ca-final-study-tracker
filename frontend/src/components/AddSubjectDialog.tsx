import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SubjectForm } from './SubjectForm';

interface AddSubjectDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddSubjectDialog({ children, onSuccess }: AddSubjectDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
        </DialogHeader>
        <SubjectForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
