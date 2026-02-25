import React, { useState } from 'react';
import RevisionSchedule from '../components/RevisionSchedule';
import { AddRevisionDialog } from '../components/AddRevisionDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';

export default function RevisionSchedulePage() {
  const { subjects } = useSubjects();
  const hasSubjects = subjects.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Revision Schedule</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Plan and track your revision sessions
          </p>
        </div>
        <AddRevisionDialog>
          <Button size="sm" disabled={!hasSubjects}>
            <Plus className="h-4 w-4 mr-1" />
            Add Revision
          </Button>
        </AddRevisionDialog>
      </div>
      {!hasSubjects && (
        <p className="text-sm text-muted-foreground">
          Add subjects first before scheduling revisions.
        </p>
      )}
      <RevisionSchedule />
    </div>
  );
}
