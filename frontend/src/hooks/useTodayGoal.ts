import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Goal, ExtendedActor } from '../lib/actorTypes';

export function useTodayGoal() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Goal | null>({
    queryKey: ['todayGoal'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as unknown as ExtendedActor).getTodayGoal();
      } catch (err) {
        console.warn('useTodayGoal: could not fetch goal', err);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    goal: query.data ?? null,
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
