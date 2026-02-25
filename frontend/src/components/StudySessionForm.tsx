import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { useSubjects } from '../hooks/useSubjects';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ExtendedActor, StudySession } from '../lib/actorTypes';

export default function StudySessionForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { subjects } = useSubjects();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [hours, setHours] = useState('');
  const [topics, setTopics] = useState('');
  const [summary, setSummary] = useState('');
  const [errorLog, setErrorLog] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      const session: StudySession = {
        date: BigInt(new Date(date).getTime()) * 1_000_000n,
        subject,
        hoursStudied: BigInt(hours || '0'),
        topicsCovered: topics,
        errorLog: errorLog.trim() ? errorLog.trim() : undefined,
      };
      await extActor.addStudySession(session);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studySessions'] });
      queryClient.invalidateQueries({ queryKey: ['sessionSummaries'] });
      queryClient.invalidateQueries({ queryKey: ['errorLogs'] });
      setSubject('');
      setHours('');
      setTopics('');
      setSummary('');
      setErrorLog('');
      toast.success('Study session logged!');
    },
    onError: () => {
      toast.error('Failed to log study session');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !hours || !topics) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate();
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Log Study Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={mutation.isPending}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hours Studied</Label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="e.g. 3"
                disabled={mutation.isPending}
                className="h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subject</Label>
            <Select value={subject} onValueChange={setSubject} disabled={mutation.isPending}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.name} value={s.name} className="text-xs">
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Topics Covered</Label>
            <Input
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g. Chapter 3 - Consolidation"
              disabled={mutation.isPending}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Summary (optional)</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of what you studied..."
              disabled={mutation.isPending}
              className="text-xs min-h-[60px] resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Error Log (optional)</Label>
            <Textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              placeholder="Note any mistakes or areas needing more attention..."
              disabled={mutation.isPending}
              className="text-xs min-h-[60px] resize-none"
            />
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full h-8 text-xs">
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Logging...
              </>
            ) : (
              'Log Session'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
