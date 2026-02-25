import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProgress, ExtendedActor } from '../lib/actorTypes';

export function useUserProgress() {
  const { actor, isFetching } = useActor();

  const query = useQuery<UserProgress | null>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as unknown as ExtendedActor).getUserProgress();
      } catch (err) {
        console.warn('useUserProgress: could not fetch progress', err);
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    progress: query.data ?? null,
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

export function useInvalidateUserProgress() {
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.invalidateQueries({ queryKey: ['userProgress'] });
  };
}
