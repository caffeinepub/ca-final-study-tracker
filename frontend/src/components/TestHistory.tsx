import React from 'react';
import { useCompletedTests } from '../hooks/useCompletedTests';
import { usePendingTests } from '../hooks/usePendingTests';
import { useSubjects } from '../hooks/useSubjects';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList } from 'lucide-react';
import TestCard from './TestCard';

export default function TestHistory() {
  const { data: completedTests, isLoading: completedLoading } = useCompletedTests();
  const { data: pendingTests, isLoading: pendingLoading } = usePendingTests();
  const { subjects } = useSubjects();

  // Compute subject-wise average scores
  const subjectScores = subjects.map((s) => {
    const subjectTests = completedTests?.filter(
      (t) => t.subject === s.name && t.scoredMarks !== undefined
    ) ?? [];
    if (subjectTests.length === 0) return { name: s.name, avg: 0, count: 0 };
    const avg =
      subjectTests.reduce((sum, t) => {
        const pct = t.totalMarks > 0n ? (Number(t.scoredMarks!) / Number(t.totalMarks)) * 100 : 0;
        return sum + pct;
      }, 0) / subjectTests.length;
    return { name: s.name, avg: Math.round(avg), count: subjectTests.length };
  });

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          Test History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList className="h-8 text-xs mb-3">
            <TabsTrigger value="pending" className="text-xs h-7">
              Pending ({pendingTests?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs h-7">
              Completed ({completedTests?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs h-7">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {pendingLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : (pendingTests?.length ?? 0) === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No pending tests.</p>
            ) : (
              <div className="space-y-2">
                {pendingTests!.map((test, i) => (
                  <TestCard key={`${test.name}-${i}`} test={test} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedLoading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : (completedTests?.length ?? 0) === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No completed tests.</p>
            ) : (
              <div className="space-y-2">
                {completedTests!.map((test, i) => (
                  <TestCard key={`${test.name}-${i}`} test={test} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="progress">
            <div className="space-y-3">
              {subjectScores.filter((s) => s.count > 0).length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">
                  Complete some tests to see progress.
                </p>
              ) : (
                subjectScores
                  .filter((s) => s.count > 0)
                  .map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{s.name}</span>
                        <span className="text-muted-foreground">{s.avg}% avg ({s.count} tests)</span>
                      </div>
                      <Progress value={s.avg} className="h-2" />
                    </div>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
