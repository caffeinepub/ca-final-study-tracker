import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor, Reward } from '../lib/actorTypes';

export function useEvaluateRewards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const extActor = actor as unknown as ExtendedActor;
      // Fetch current rewards to check which are unlocked
      return await extActor.getRewards();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
}
