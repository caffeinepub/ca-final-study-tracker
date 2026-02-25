import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Test, ExtendedActor } from '../lib/actorTypes';

export function useCompletedTests() {
  const { actor, isFetching } = useActor();

  return useQuery<Test[]>({
    queryKey: ['completedTests'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getCompletedTests();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
