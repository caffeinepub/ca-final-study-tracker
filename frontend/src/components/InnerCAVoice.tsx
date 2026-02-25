import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Quote } from 'lucide-react';
import { getRandomQuote, getRandomQuoteExcluding } from '../utils/caQuotes';

export function InnerCAVoice() {
  const [quote, setQuote] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setQuote((prev) => getRandomQuoteExcluding(prev));
      setIsRefreshing(false);
    }, 300);
  };

  // Split quote into message and signature
  const parts = quote.split(' — Your Future CA Self');
  const message = parts[0] ?? quote;

  return (
    <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/5 to-primary/5 shadow-web overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-md mt-1">
            <Quote className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary mb-2">
              Inner CA Voice 🎓
            </p>
            <blockquote
              className={`text-sm font-medium italic leading-relaxed text-foreground transition-opacity duration-300 ${isRefreshing ? 'opacity-0' : 'opacity-100'}`}
            >
              "{message}"
            </blockquote>
            <p className="mt-2 text-xs font-semibold text-primary">— Your Future CA Self</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
            title="New quote"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
