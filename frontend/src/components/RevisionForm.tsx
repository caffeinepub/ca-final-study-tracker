import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useSubjects } from '../hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedActor, RevisionTopic } from '../lib/actorTypes';

interface RevisionFormProps {
  onSuccess?: () => void;
}

export default function RevisionForm({ onSuccess }: RevisionFormProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { subjects } = useSubjects();

  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      const revisionTopic: RevisionTopic = {
        subject,
        topic,
        scheduledDate: BigInt(new Date(scheduledDate).getTime()) * 1_000_000n,
        isComplete: false,
      };
      await extActor.addRevisionTopic(revisionTopic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisionTopics'] });
      setSubject('');
      setTopic('');
      toast.success('Revision topic added!');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to add revision topic');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic) {
      toast.error('Please fill in all fields');
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Subject</Label>
        <Select value={subject} onValueChange={setSubject} disabled={mutation.isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Select subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Topic</Label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Consolidation of Accounts"
          disabled={mutation.isPending}
        />
      </div>
      <div className="space-y-2">
        <Label>Scheduled Date</Label>
        <Input
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          disabled={mutation.isPending}
        />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Revision Topic'
        )}
      </Button>
    </form>
  );
}
