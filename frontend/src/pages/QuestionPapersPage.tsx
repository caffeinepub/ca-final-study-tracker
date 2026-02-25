import { FileQuestion } from 'lucide-react';
import { QuestionPaperUploader } from '../components/QuestionPaperUploader';
import { QuestionPaperList } from '../components/QuestionPaperList';
import { Separator } from '@/components/ui/separator';

export function QuestionPapersPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10">
          <FileQuestion className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Question Papers
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Upload and revisit past question papers when reattempting 📝
          </p>
        </div>
      </div>

      {/* Uploader */}
      <QuestionPaperUploader />

      <Separator />

      {/* List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your Papers</h2>
        <QuestionPaperList />
      </div>
    </div>
  );
}
