import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, FileText } from 'lucide-react';
import { usePdfBlobs } from '../hooks/usePdfBlobs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PdfViewerProps {
  chapterId: string;
  chapterName: string;
}

export function PdfViewer({ chapterId, chapterName }: PdfViewerProps) {
  const [open, setOpen] = useState(false);
  const { data: pdfData, isLoading, error } = usePdfBlobs(open ? chapterId : null);
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
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${chapterName}-notes.pdf`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <FileText className="h-3 w-3" />
          View Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Study Notes — {chapterName}</DialogTitle>
          <DialogDescription>View and download your PDF notes</DialogDescription>
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
            No PDF found for this chapter.
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
              <iframe src={pdfUrl} className="w-full h-full" title={`${chapterName} notes`} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
