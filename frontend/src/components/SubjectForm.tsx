import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ExtendedActor } from '../lib/actorTypes';
import { Loader2 } from 'lucide-react';

interface SubjectFormProps {
  onSuccess?: () => void;
}

export function SubjectForm({ onSuccess }: SubjectFormProps) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [totalChapters, setTotalChapters] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!identity) throw new Error('Please log in to add subjects');
      const extActor = actor as unknown as ExtendedActor;
      await extActor.addSubject(name.trim(), BigInt(totalChapters || '0'));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      setName('');
      setTotalChapters('');
      setError('');
      onSuccess?.();
    },
    onError: (err: Error) => {
      if (err.message.includes('Unauthorized') || err.message.includes('authorized')) {
        setError('You are not authorized to add subjects. Please make sure you are logged in.');
      } else {
        setError(err.message || 'Failed to add subject');
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }
    if (!identity) {
      setError('Please log in to add subjects');
      return;
    }
    mutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject-name">Subject Name</Label>
        <Input
          id="subject-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Financial Reporting"
          disabled={mutation.isPending}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="total-chapters">Total Chapters</Label>
        <Input
          id="total-chapters"
          type="number"
          min="0"
          value={totalChapters}
          onChange={(e) => setTotalChapters(e.target.value)}
          placeholder="e.g. 12"
          disabled={mutation.isPending}
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" disabled={mutation.isPending || !identity} className="w-full">
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : (
          'Add Subject'
        )}
      </Button>
      {!identity && (
        <p className="text-xs text-muted-foreground text-center">
          You must be logged in to add subjects.
        </p>
      )}
    </form>
  );
}
