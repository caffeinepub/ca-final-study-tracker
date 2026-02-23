import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

interface AddChapterDialogProps {
  subjectName: string;
  onSuccess: () => void;
  children: React.ReactNode;
}

export function AddChapterDialog({ subjectName, onSuccess, children }: AddChapterDialogProps) {
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    chapterName: '',
    totalTopics: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    if (!formData.chapterName.trim()) {
      toast.error('Please enter a chapter name');
      return;
    }

    if (formData.totalTopics <= 0) {
      toast.error('Total topics must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    try {
      await actor.addChapter(subjectName, formData.chapterName, BigInt(formData.totalTopics));
      toast.success('Chapter added successfully');
      setFormData({ chapterName: '', totalTopics: 0 });
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding chapter:', error);
      toast.error('Failed to add chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
          <DialogDescription>Add a chapter to {subjectName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chapterName">Chapter Name</Label>
            <Input
              id="chapterName"
              value={formData.chapterName}
              onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
              placeholder="e.g., Chapter 1: Introduction"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalTopics">Total Topics</Label>
            <Input
              id="totalTopics"
              type="number"
              min="1"
              value={formData.totalTopics || ''}
              onChange={(e) => setFormData({ ...formData, totalTopics: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 10"
              disabled={isSubmitting}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Chapter
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
