import { QuestionPaperUploader } from '../components/QuestionPaperUploader';
import { QuestionPaperList } from '../components/QuestionPaperList';
import { FileText } from 'lucide-react';

export default function QuestionPapersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Question Papers
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload and manage your CA exam question papers for reference
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionPaperUploader />
        <QuestionPaperList />
      </div>
    </div>
  );
}
