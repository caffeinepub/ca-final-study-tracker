import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TestForm from './TestForm';

interface AddTestDialogProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

export function AddTestDialog({ children, onSuccess }: AddTestDialogProps) {
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
          <DialogTitle>Add New Test</DialogTitle>
        </DialogHeader>
        <TestForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
