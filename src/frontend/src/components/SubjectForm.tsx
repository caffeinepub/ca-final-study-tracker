import { useState } from 'react';
import { type Subject } from '../backend';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface SubjectFormProps {
  subject?: Subject;
  onSuccess: () => void;
}

export function SubjectForm({ subject, onSuccess }: SubjectFormProps) {
  const { actor } = useActor();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: subject?.name || '',
    totalTopics: subject ? Number(subject.totalTopics) : 0,
    completedTopics: subject ? Number(subject.completedTopics) : 0,
    targetDate: subject
      ? new Date(Number(subject.targetCompletionDate) / 1_000_000).toISOString().split('T')[0]
      : '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a subject name');
      return;
    }

    if (formData.totalTopics <= 0) {
      toast.error('Total topics must be greater than 0');
      return;
    }

    if (!formData.targetDate) {
      toast.error('Please select a target date');
      return;
    }

    setIsSubmitting(true);

    try {
      const targetDateMs = new Date(formData.targetDate).getTime();
      const targetDateNs = BigInt(targetDateMs) * BigInt(1_000_000);

      if (subject) {
        // Update existing subject
        await actor.updateCompletedTopics(formData.name, BigInt(formData.completedTopics));
        toast.success('Subject updated successfully');
      } else {
        // Add new subject
        await actor.addSubject(formData.name, BigInt(formData.totalTopics), targetDateNs);
        toast.success('Subject added successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast.error(subject ? 'Failed to update subject' : 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Subject Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Financial Reporting"
          disabled={!!subject || isSubmitting}
          required
        />
      </div>

      {!subject && (
        <div className="space-y-2">
          <Label htmlFor="totalTopics">Total Topics</Label>
          <Input
            id="totalTopics"
            type="number"
            min="1"
            value={formData.totalTopics || ''}
            onChange={(e) => setFormData({ ...formData, totalTopics: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 25"
            disabled={isSubmitting}
            required
          />
        </div>
      )}

      {subject && (
        <div className="space-y-2">
          <Label htmlFor="completedTopics">Completed Topics</Label>
          <Input
            id="completedTopics"
            type="number"
            min="0"
            max={formData.totalTopics}
            value={formData.completedTopics || ''}
            onChange={(e) => setFormData({ ...formData, completedTopics: parseInt(e.target.value) || 0 })}
            disabled={isSubmitting}
            required
          />
          <p className="text-xs text-muted-foreground">Out of {formData.totalTopics} total topics</p>
        </div>
      )}

      {!subject && (
        <div className="space-y-2">
          <Label htmlFor="targetDate">Target Completion Date</Label>
          <Input
            id="targetDate"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            disabled={isSubmitting}
            required
          />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {subject ? 'Update Progress' : 'Add Subject'}
      </Button>
    </form>
  );
}
