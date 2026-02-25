import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompletedTests } from '../hooks/useCompletedTests';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function TestAnalyticsChart() {
  const { data: completedTests, isLoading } = useCompletedTests();

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!completedTests || completedTests.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Test Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No completed tests yet. Complete tests to see analytics here. 📈
          </p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for line chart (scores over time)
  const timelineData = completedTests
    .map((test) => ({
      name: test.name,
      date: new Date(Number(test.date) / 1_000_000),
      subject: test.subject,
      percentage:
        test.scoredMarks !== undefined && test.totalMarks > 0n
          ? (Number(test.scoredMarks) / Number(test.totalMarks)) * 100
          : 0,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((item) => ({
      name: item.name,
      date: item.date.toLocaleDateString(),
      [item.subject]: item.percentage,
    }));

  // Prepare data for bar chart (average scores by subject)
  const subjectScores = new Map<string, { total: number; count: number }>();
  completedTests.forEach((test) => {
    if (test.scoredMarks !== undefined && test.totalMarks > 0n) {
      const percentage = (Number(test.scoredMarks) / Number(test.totalMarks)) * 100;
      const existing = subjectScores.get(test.subject) || { total: 0, count: 0 };
      subjectScores.set(test.subject, {
        total: existing.total + percentage,
        count: existing.count + 1,
      });
    }
  });

  const subjectData = Array.from(subjectScores.entries()).map(([subject, scores]) => ({
    subject,
    average: scores.total / scores.count,
  }));

  const uniqueSubjects = Array.from(new Set(completedTests.map((t) => t.subject)));
  const lineColors = ['oklch(var(--primary))', 'oklch(var(--secondary))', 'oklch(var(--chart-1))', 'oklch(var(--chart-4))'];

  return (
    <Card className="border-2 border-primary/20 shadow-web">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Test Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Score Timeline</TabsTrigger>
            <TabsTrigger value="subjects">Subject Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="oklch(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="oklch(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                {uniqueSubjects.map((subject, index) => (
                  <Line
                    key={`line-${subject}`}
                    type="monotone"
                    dataKey={subject}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                    dot={{ fill: lineColors[index % lineColors.length] }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="subjects" className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
                <XAxis
                  dataKey="subject"
                  stroke="oklch(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="oklch(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(var(--card))',
                    border: '1px solid oklch(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="average"
                  fill="oklch(var(--primary))"
                  radius={[8, 8, 0, 0]}
                  name="Average Score (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
