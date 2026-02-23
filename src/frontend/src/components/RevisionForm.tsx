import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useSubjects } from '../hooks/useSubjects';
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
  const { subjects } = useSubjects();
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

      await actor.addRevisionTopic(formData.subject, formData.topic, dateNs);

      toast.success('Revision topic added successfully');
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
          disabled={isSubmitting}
        >
          <SelectTrigger id="subject">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem key={subject.name} value={subject.name}>
                {subject.name}
              </SelectItem>
            ))}
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

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Revision
      </Button>
    </form>
  );
}
