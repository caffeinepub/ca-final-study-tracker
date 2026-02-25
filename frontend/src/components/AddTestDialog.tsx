import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TestForm } from './TestForm';

interface AddTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTestDialog({ open, onOpenChange }: AddTestDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Test</DialogTitle>
          <DialogDescription>Create a new test to track your performance</DialogDescription>
        </DialogHeader>
        <TestForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
