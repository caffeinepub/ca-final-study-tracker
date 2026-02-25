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

interface TestFormProps {
  onSuccess: () => void;
}

export function TestForm({ onSuccess }: TestFormProps) {
  const { actor } = useActor();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    date: '',
    totalMarks: 0,
    chapters: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error('Backend not initialized');
      return;
    }

    if (!formData.name.trim() || !formData.subject || !formData.date || formData.totalMarks <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateMs = new Date(formData.date).getTime();
      const dateNs = BigInt(dateMs) * BigInt(1_000_000);
      const chaptersArray = formData.chapters
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      await (actor as unknown as ExtendedActor).addTest(
        formData.name,
        formData.subject,
        dateNs,
        BigInt(formData.totalMarks),
        chaptersArray
      );

      toast.success('Test added successfully');
      setFormData({ name: '', subject: '', date: '', totalMarks: 0, chapters: '' });
      onSuccess();
    } catch (error) {
      console.error('Error adding test:', error);
      toast.error('Failed to add test');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="testName">Test Name</Label>
        <Input
          id="testName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mock Test 1"
          disabled={isSubmitting}
          required
        />
      </div>

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
        <Label htmlFor="date">Test Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalMarks">Total Marks</Label>
        <Input
          id="totalMarks"
          type="number"
          min="1"
          value={formData.totalMarks || ''}
          onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })}
          placeholder="e.g., 100"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="chapters">Chapters (Optional, comma-separated)</Label>
        <Input
          id="chapters"
          value={formData.chapters}
          onChange={(e) => setFormData({ ...formData, chapters: e.target.value })}
          placeholder="e.g., Chapter 1, Chapter 2"
          disabled={isSubmitting}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
        disabled={isSubmitting || subjectsLoading || subjects.length === 0}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Add Test
      </Button>
    </form>
  );
}
