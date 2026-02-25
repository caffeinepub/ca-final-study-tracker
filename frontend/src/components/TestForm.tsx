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
import type { ExtendedActor, Test } from '../lib/actorTypes';

interface TestFormProps {
  onSuccess?: () => void;
}

export default function TestForm({ onSuccess }: TestFormProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { subjects } = useSubjects();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalMarks, setTotalMarks] = useState('100');
  const [chapters, setChapters] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      const test: Test = {
        name,
        subject,
        date: BigInt(new Date(date).getTime()) * 1_000_000n,
        totalMarks: BigInt(totalMarks || '100'),
        scoredMarks: undefined,
        chapters: chapters.split(',').map((c) => c.trim()).filter(Boolean),
        isCompleted: false,
      };
      await extActor.addTest(test);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingTests'] });
      queryClient.invalidateQueries({ queryKey: ['allTests'] });
      setName('');
      setSubject('');
      setChapters('');
      toast.success('Test added!');
      onSuccess?.();
    },
    onError: () => {
      toast.error('Failed to add test');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Test Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Mock Test 1"
          disabled={mutation.isPending}
        />
      </div>
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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label>Total Marks</Label>
          <Input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            disabled={mutation.isPending}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Chapters (comma-separated)</Label>
        <Input
          value={chapters}
          onChange={(e) => setChapters(e.target.value)}
          placeholder="e.g. Ch1, Ch2, Ch3"
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
          'Add Test'
        )}
      </Button>
    </form>
  );
}
