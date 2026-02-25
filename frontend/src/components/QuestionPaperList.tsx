import { useState } from 'react';
import { FileText, Eye, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { QuestionPaperViewer } from './QuestionPaperViewer';
import { useQuestionPapers } from '../hooks/useQuestionPapers';

function formatDate(time: bigint): string {
  const ms = Number(time) / 1_000_000;
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(ms));
}

export function QuestionPaperList() {
  const { papers, isLoading, error } = useQuestionPapers();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null);

  const handleView = (name: string) => {
    setSelectedPaper(name);
    setViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-destructive text-sm text-center py-6">
        Failed to load question papers. Please refresh.
      </p>
    );
  }

  if (papers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <BookOpen className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-muted-foreground font-medium">No question papers uploaded yet</p>
        <p className="text-sm text-muted-foreground/70">
          Upload your first question paper above to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {papers.map((paper) => (
          <Card
            key={paper.name}
            className="border border-border/60 hover:border-primary/40 transition-colors"
          >
            <CardContent className="flex items-center justify-between py-4 px-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{paper.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {formatDate(paper.uploadDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs hidden sm:flex">
                  PDF
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleView(paper.name)}
                  className="gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <QuestionPaperViewer
        paperName={selectedPaper}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </>
  );
}
