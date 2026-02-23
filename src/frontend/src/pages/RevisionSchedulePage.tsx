import { RevisionSchedule } from '../components/RevisionSchedule';
import { AddRevisionDialog } from '../components/AddRevisionDialog';
import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RevisionSchedulePage() {
  const { refetch } = useRevisionSchedule();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revision Schedule</h2>
            <p className="text-muted-foreground">Plan and track your revision topics</p>
          </div>
        </div>
        <AddRevisionDialog onSuccess={refetch}>
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Add Revision
          </Button>
        </AddRevisionDialog>
      </div>

      <RevisionSchedule onUpdate={refetch} />
    </div>
  );
}
