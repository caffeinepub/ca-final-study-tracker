import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useSubjects } from '../hooks/useSubjects';
import type { ExtendedActor } from '../lib/actorTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface RevisionFormProps {
  onSuccess: () => void;
}

export function RevisionForm({ onSuccess }: RevisionFormProps) {
  const { actor } = useActor();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    scheduledDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    if (!formData.scheduledDate) {
      toast.error('Please select a scheduled date');
      return;
    }

    setIsSubmitting(true);

    try {
      const dateMs = new Date(formData.scheduledDate).getTime();
      const dateNs = BigInt(dateMs) * BigInt(1_000_000);

      await (actor as unknown as ExtendedActor).addRevisionTopic(
        formData.subject,
        formData.topic,
        dateNs
      );

      toast.success('Revision topic added successfully');
      setFormData({ subject: '', topic: '', scheduledDate: '' });
      onSuccess();
    } catch (error) {
      console.error('Error adding revision topic:', error);
      toast.error('Failed to add revision topic');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select
          value={formData.subject}
          onValueChange={(value) => setFormData({ ...formData, subject: value })}
          disabled={isSubmitting || subjectsLoading}
        >
          <SelectTrigger id="subject">
            <SelectValue
              placeholder={
                subjectsLoading
                  ? 'Loading subjects...'
                  : subjects.length === 0
                  ? 'No subjects available'
                  : 'Select a subject'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {subjects.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No subjects available. Add subjects from the Dashboard first.
              </div>
            ) : (
              subjects.map((subject) => (
                <SelectItem key={subject.name} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Input
          id="topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          placeholder="e.g., Consolidation of Financial Statements"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduledDate">Scheduled Date</Label>
        <Input
          id="scheduledDate"
          type="date"
          value={formData.scheduledDate}
          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
          disabled={isSubmitting}
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || subjectsLoading || subjects.length === 0}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Revision
      </Button>
    </form>
  );
}
