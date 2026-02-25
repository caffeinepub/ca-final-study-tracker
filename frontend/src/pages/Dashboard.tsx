import { useSubjects } from '../hooks/useSubjects';
import { useChapters } from '../hooks/useChapters';
import { SubjectCard } from '../components/SubjectCard';
import { AddSubjectDialog } from '../components/AddSubjectDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, BookOpen, Layers, Zap } from 'lucide-react';
import { XPLevelCard } from '../components/XPLevelCard';
import { StreakFlameCard } from '../components/StreakFlameCard';
import TodayGoalCard from '../components/TodayGoalCard';
import AISuggester from '../components/AISuggester';
import ExamCountdown from '../components/ExamCountdown';
import { InnerCAVoice } from '../components/InnerCAVoice';

export default function Dashboard() {
  const { subjects, isLoading: subjectsLoading } = useSubjects();
  const { data: chapters } = useChapters();

  const totalSubjects = subjects.length;
  const totalChapters = chapters?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-background border border-primary/20 p-6">
        <div className="absolute inset-0 web-pattern opacity-20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🕷️</span>
            <h1 className="text-2xl font-black tracking-tight">CA StudyHub</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            Your ultimate CA Final exam preparation companion. Track progress, schedule revisions, and crush your goals.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Subjects</p>
                <p className="text-xl font-bold">{totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/50">
                <Layers className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Chapters</p>
                <p className="text-xl font-bold">{totalChapters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <XPLevelCard />
        <StreakFlameCard />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              My Subjects
            </h2>
            <AddSubjectDialog>
              <Button size="sm" className="h-8 text-xs">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Subject
              </Button>
            </AddSubjectDialog>
          </div>

          {subjectsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : subjects.length === 0 ? (
            <Card className="border-dashed border-border/50">
              <CardContent className="py-12 text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  No subjects yet. Add your first subject to get started!
                </p>
                <AddSubjectDialog>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Your First Subject
                  </Button>
                </AddSubjectDialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {subjects.map((subject) => (
                <SubjectCard key={subject.name} subject={subject} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <ExamCountdown />
          <TodayGoalCard />
          <InnerCAVoice />
          <AISuggester />
        </div>
      </div>
    </div>
  );
}
