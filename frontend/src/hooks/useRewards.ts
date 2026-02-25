import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reward, ExtendedActor } from '../lib/actorTypes';

export function useRewards() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getAllRewards();
      } catch (err) {
        console.warn('useRewards: could not fetch rewards', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    rewards: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
