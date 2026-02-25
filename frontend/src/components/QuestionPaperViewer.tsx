import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuestionPaperPdf } from '../hooks/useQuestionPaperPdf';

interface QuestionPaperViewerProps {
  paperName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionPaperViewer({ paperName, open, onOpenChange }: QuestionPaperViewerProps) {
  const { data: pdfData, isLoading, error } = useQuestionPaperPdf(open ? paperName : null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfData) {
      const blob = new Blob([new Uint8Array(pdfData)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPdfUrl(null);
    }
  }, [pdfData]);

  const handleDownload = () => {
    if (!pdfUrl || !paperName) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${paperName}.pdf`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>📄 {paperName}</DialogTitle>
          <DialogDescription>View and download your question paper</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center flex-1 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>Failed to load PDF. Please try again.</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && !pdfData && (
          <div className="flex items-center justify-center flex-1 py-12 text-muted-foreground text-sm">
            No PDF found for this paper.
          </div>
        )}

        {pdfUrl && !isLoading && (
          <div className="flex flex-col flex-1 min-h-0 space-y-3">
            <div className="flex justify-end">
              <Button onClick={handleDownload} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
            <div className="flex-1 border border-border rounded-lg overflow-hidden">
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title={`${paperName} question paper`}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
