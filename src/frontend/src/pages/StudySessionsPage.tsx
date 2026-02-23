import { StudySessionForm } from '../components/StudySessionForm';
import { StudySessionHistory } from '../components/StudySessionHistory';
import { SessionSummariesView } from '../components/SessionSummariesView';
import { SubjectProgressOverview } from '../components/SubjectProgressOverview';
import { RevisionSchedule } from '../components/RevisionSchedule';
import { useStudySessions } from '../hooks/useStudySessions';
import { useRevisionSchedule } from '../hooks/useRevisionSchedule';
import { ClipboardList } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function StudySessionsPage() {
  const { refetch } = useStudySessions();
  const { refetch: refetchRevisions } = useRevisionSchedule();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Study Sessions
          </h2>
          <p className="text-muted-foreground">Log your study hours and track your progress 📚</p>
        </div>
      </div>

      {/* Subject Progress Overview */}
      <SubjectProgressOverview />

      <Separator className="my-8" />

      {/* Revision Schedule */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Revision Tracking</h3>
        <RevisionSchedule onUpdate={refetchRevisions} />
      </div>

      <Separator className="my-8" />

      {/* Study Session Form and History */}
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <StudySessionForm onSuccess={refetch} />
        </div>
        <div className="lg:col-span-3">
          <StudySessionHistory />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Session Summaries */}
      <SessionSummariesView />
    </div>
  );
}
