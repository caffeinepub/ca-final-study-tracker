import TestHistory from '../components/TestHistory';
import { AddTestDialog } from '../components/AddTestDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSubjects } from '../hooks/useSubjects';
import { TestAnalyticsChart } from '../components/TestAnalyticsChart';

export default function TestsPage() {
  const { subjects } = useSubjects();
  const hasSubjects = subjects.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Tests</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your test performance and progress
          </p>
        </div>
        <AddTestDialog>
          <Button size="sm" disabled={!hasSubjects}>
            <Plus className="h-4 w-4 mr-1" />
            Add Test
          </Button>
        </AddTestDialog>
      </div>
      {!hasSubjects && (
        <p className="text-sm text-muted-foreground">
          Add subjects first before adding tests.
        </p>
      )}
      <TestAnalyticsChart />
      <TestHistory />
    </div>
  );
}
