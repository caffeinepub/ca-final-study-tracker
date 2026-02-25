import { SubjectProgressOverview } from '../components/SubjectProgressOverview';
import RevisionSchedule from '../components/RevisionSchedule';
import StudySessionForm from '../components/StudySessionForm';
import StudySessionHistory from '../components/StudySessionHistory';
import { SessionSummariesView } from '../components/SessionSummariesView';

export default function StudySessionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Study Sessions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Log your study sessions and track your progress
        </p>
      </div>

      <SubjectProgressOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StudySessionForm />
          <SessionSummariesView />
        </div>
        <div className="space-y-6">
          <RevisionSchedule />
          <StudySessionHistory />
        </div>
      </div>
    </div>
  );
}
