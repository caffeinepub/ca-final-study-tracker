import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestCard } from './TestCard';
import { useTests } from '../hooks/useTests';
import { usePendingTests } from '../hooks/usePendingTests';
import { useCompletedTests } from '../hooks/useCompletedTests';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSubjects } from '../hooks/useSubjects';

export function TestHistory() {
  const { tests, isLoading: allLoading, refetch: refetchAll } = useTests();
  const { pendingTests, isLoading: pendingLoading, refetch: refetchPending } = usePendingTests();
  const { completedTests, isLoading: completedLoading, refetch: refetchCompleted } = useCompletedTests();
  const { subjects } = useSubjects();

  const refetchAll3 = () => {
    refetchAll();
    refetchPending();
    refetchCompleted();
  };

  if (allLoading || pendingLoading || completedLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Calculate subject-wise progress
  const subjectProgress = new Map<string, { total: number; scored: number; count: number }>();
  completedTests.forEach((test) => {
    if (test.scoredMarks && test.totalMarks) {
      const existing = subjectProgress.get(test.subject) || { total: 0, scored: 0, count: 0 };
      subjectProgress.set(test.subject, {
        total: existing.total + Number(test.totalMarks),
        scored: existing.scored + Number(test.scoredMarks),
        count: existing.count + 1,
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Subject-wise Progress Bars */}
      {subjectProgress.size > 0 && (
        <Card className="border-2 border-primary/20 shadow-web">
          <CardHeader>
            <CardTitle>Subject-wise Test Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from(subjectProgress.entries()).map(([subject, data]) => {
                const percentage = (data.scored / data.total) * 100;
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{subject}</span>
                      <span className="text-muted-foreground">
                        {data.scored} / {data.total} ({percentage.toFixed(1)}%) • {data.count} test{data.count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary"
                    />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tests ({tests.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTests.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {tests.length === 0 ? (
            <Alert>
              <AlertDescription>No tests added yet. Create your first test to get started! 🎯</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tests.map((test) => (
                <TestCard key={test.name} test={test} onUpdate={refetchAll3} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingTests.length === 0 ? (
            <Alert>
              <AlertDescription>No pending tests. All tests have been completed! ✅</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingTests.map((test) => (
                <TestCard key={test.name} test={test} onUpdate={refetchAll3} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedTests.length === 0 ? (
            <Alert>
              <AlertDescription>No completed tests yet. Add scores to your tests to see them here! 📝</AlertDescription>
            </Alert>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {completedTests.map((test) => (
                <TestCard key={test.name} test={test} onUpdate={refetchAll3} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
