import { RefreshCw, Vault } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RewardCard } from '../components/RewardCard';
import { useRewards } from '../hooks/useRewards';
import { useEvaluateRewards } from '../hooks/useEvaluateRewards';
import { toast } from 'sonner';

export function RewardVaultPage() {
  const { rewards, isLoading, error } = useRewards();
  const evaluateMutation = useEvaluateRewards();

  const handleEvaluate = async () => {
    try {
      const updated = await evaluateMutation.mutateAsync();
      const newlyUnlocked = updated.filter((r) => r.isUnlocked);
      if (newlyUnlocked.length > 0) {
        toast.success(`🎉 ${newlyUnlocked.map((r) => r.name).join(', ')} unlocked!`);
      } else {
        toast.info('No new rewards unlocked yet. Keep studying! 💪');
      }
    } catch {
      toast.error('Failed to evaluate rewards. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Vault className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Reward Vault
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Study hard and unlock real-life rewards 🏆
            </p>
          </div>
        </div>
        <Button
          onClick={handleEvaluate}
          disabled={evaluateMutation.isPending}
          className="gap-2"
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 ${evaluateMutation.isPending ? 'animate-spin' : ''}`} />
          {evaluateMutation.isPending ? 'Checking...' : 'Check Rewards'}
        </Button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <p>
          🎯 <strong className="text-foreground">How it works:</strong> Hit your study milestones to
          unlock real-life rewards. Study <strong className="text-foreground">8+ hours in a day</strong>{' '}
          to earn a day out, or maintain an{' '}
          <strong className="text-foreground">8-hour daily streak for 30 days</strong> to earn a mini
          holiday!
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>Failed to load rewards. Please refresh the page.</AlertDescription>
        </Alert>
      )}

      {/* Rewards grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rewards.length === 0 ? (
            <p className="text-muted-foreground col-span-2 text-center py-12">
              No rewards found. Click "Check Rewards" to evaluate your progress.
            </p>
          ) : (
            rewards.map((reward) => <RewardCard key={reward.id} reward={reward} />)
          )}
        </div>
      )}
    </div>
  );
}
