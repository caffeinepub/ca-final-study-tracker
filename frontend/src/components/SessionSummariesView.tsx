import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Copy, Loader2 } from 'lucide-react';
import { useSessionSummaries } from '../hooks/useSessionSummaries';
import type { SessionSummaryEntry } from '../hooks/useSessionSummaries';
import { toast } from 'sonner';

export function SessionSummariesView() {
  const { data: summaries, isLoading } = useSessionSummaries();

  const handleCopy = (entry: SessionSummaryEntry) => {
    const text = entry.value?.content ?? '';
    navigator.clipboard.writeText(text);
    toast.success('Summary copied to clipboard');
  };

  const getContent = (entry: SessionSummaryEntry): string => {
    return entry.value?.content ?? '';
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Session Summaries for Final Revision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summaries || summaries.length === 0) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Session Summaries for Final Revision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No summaries yet. Add summaries when logging study sessions to see them here for final revision. 📝
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20 shadow-web">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Session Summaries for Final Revision ({summaries.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {summaries.map((entry, index) => (
              <div
                key={entry.key ?? index}
                className="rounded-lg border-2 border-border bg-card/50 p-4 transition-all hover:border-primary/30"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm">Summary #{summaries.length - index}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(entry)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans">
                  {getContent(entry)}
                </pre>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
