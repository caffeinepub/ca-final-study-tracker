import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reward, ExtendedActor } from '../lib/actorTypes';

export function useEvaluateRewards() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Reward[], Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return (actor as unknown as ExtendedActor).evaluateRewards();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
}
