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
import { usePdfBlobs } from '../hooks/usePdfBlobs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PdfViewerProps {
  chapterName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfViewer({ chapterName, open, onOpenChange }: PdfViewerProps) {
  const { pdfBlob, isLoading, error } = usePdfBlobs(chapterName);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (pdfBlob) {
      const blob = new Blob([new Uint8Array(pdfBlob)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${chapterName}-notes.pdf`;
    link.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Study Notes - {chapterName}</DialogTitle>
          <DialogDescription>View and download your PDF notes</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>Failed to load PDF. Please try again.</AlertDescription>
          </Alert>
        )}

        {pdfUrl && !isLoading && (
          <div className="space-y-4 flex-1 flex flex-col">
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
