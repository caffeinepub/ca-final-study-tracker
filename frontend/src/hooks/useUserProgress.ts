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
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getUserProgress();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });

  return { progress: query.data ?? null, isLoading: query.isLoading, error: query.error };
}

export function useInvalidateUserProgress() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['userProgress'] });
}
