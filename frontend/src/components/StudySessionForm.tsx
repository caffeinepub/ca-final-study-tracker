import { useState } from 'react';
import { useActor } from '../hooks/useActor';
import { useSubjects } from '../hooks/useSubjects';
import type { ExtendedActor } from '../lib/actorTypes';
import { useInvalidateUserProgress } from '../hooks/useUserProgress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Zap } from 'lucide-react';

interface StudySessionFormProps {
  onSuccess: () => void;
}

export function StudySessionForm({ onSuccess }: StudySessionFormProps) {
  const { actor } = useActor();
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const invalidateUserProgress = useInvalidateUserProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    subject: '',
    hours: 0,
    topics: '',
    summary: '',
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

    if (formData.hours <= 0) {
      toast.error('Hours studied must be greater than 0');
      return;
    }

    if (!formData.topics.trim()) {
      toast.error('Please describe the topics covered');
      return;
    }

    setIsSubmitting(true);

    try {
      const ext = actor as unknown as ExtendedActor;
      const dateMs = new Date(formData.date).getTime();
      const dateNs = BigInt(dateMs) * BigInt(1_000_000);

      const xpResponse = await ext.addStudySession(
        dateNs,
        formData.subject,
        BigInt(formData.hours),
        formData.topics
      );

      // Save session summary if provided
      if (formData.summary.trim()) {
        const sessionId = `${formData.subject}-${dateMs}`;
        const formattedSummary = `
📅 Date: ${new Date(formData.date).toLocaleDateString()}
📚 Subject: ${formData.subject}
⏱️ Duration: ${formData.hours} hours
📝 Topics: ${formData.topics}

✨ Summary & Important Points:
${formData.summary}
        `.trim();

        await ext.saveSessionSummary(sessionId, formattedSummary);
      }

      const xpGained = Number(formData.hours) * 10;
      toast.success(
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-yellow-500" />
          <span>
            Session logged! <strong>+{xpGained} XP</strong> earned
            {xpResponse && ` · Level ${Number(xpResponse.level)}`}
          </span>
        </div>
      );

      await invalidateUserProgress();

      setFormData({
        date: new Date().toISOString().split('T')[0],
        subject: '',
        hours: 0,
        topics: '',
        summary: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error logging study session:', error);
      toast.error('Failed to log study session');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <CardTitle>Log Study Session</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
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
            <Label htmlFor="hours">Hours Studied</Label>
            <Input
              id="hours"
              type="number"
              min="0.5"
              step="0.5"
              value={formData.hours || ''}
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 2.5"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Topics Covered</Label>
            <Textarea
              id="topics"
              value={formData.topics}
              onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
              placeholder="Describe the topics you studied..."
              rows={3}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary">Session Summary & Important Points (Optional)</Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="Write your summary and important topics for final revision..."
              rows={4}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              This will be formatted and saved for your final revision reference 📝
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            disabled={isSubmitting || subjectsLoading || subjects.length === 0}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Log Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
