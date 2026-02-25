import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import RevisionForm from './RevisionForm';

interface AddRevisionDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddRevisionDialog({ children, onSuccess }: AddRevisionDialogProps) {
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
          <DialogTitle>Add Revision Topic</DialogTitle>
        </DialogHeader>
        <RevisionForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
