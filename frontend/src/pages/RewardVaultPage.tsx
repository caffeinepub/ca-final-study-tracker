import { useRewards } from '../hooks/useRewards';
import { useEvaluateRewards } from '../hooks/useEvaluateRewards';
import { RewardCard } from '../components/RewardCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function RewardVaultPage() {
  const { data: rewards, isLoading } = useRewards();
  const evaluateMutation = useEvaluateRewards();

  const handleCheckRewards = async () => {
    try {
      const result = await evaluateMutation.mutateAsync();
      const unlocked = Array.isArray(result) ? result.filter((r) => r.isUnlocked) : [];
      if (unlocked.length > 0) {
        toast.success(`🎉 ${unlocked.length} reward(s) unlocked!`);
      } else {
        toast.info('No new rewards unlocked yet. Keep studying!');
      }
    } catch {
      toast.error('Failed to check rewards');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Reward Vault
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Unlock rewards as you achieve your study goals
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleCheckRewards}
          disabled={evaluateMutation.isPending}
        >
          {evaluateMutation.isPending ? (
            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-1" />
          )}
          Check Rewards
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : !rewards || rewards.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No rewards available yet. Keep studying to unlock them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      )}
    </div>
  );
}
