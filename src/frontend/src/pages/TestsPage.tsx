import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddTestDialog } from '../components/AddTestDialog';
import { TestHistory } from '../components/TestHistory';
import { TestAnalyticsChart } from '../components/TestAnalyticsChart';
import { Separator } from '@/components/ui/separator';

export function TestsPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tests & Results
          </h2>
          <p className="text-muted-foreground mt-1">Track your test performance and scores 📊</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90">
          <Plus className="h-5 w-5" />
          Add Test
        </Button>
      </div>

      <TestAnalyticsChart />

      <Separator className="my-8" />

      <TestHistory />

      <AddTestDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
}
