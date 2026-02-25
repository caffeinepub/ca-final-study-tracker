import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Goal, ExtendedActor } from '../lib/actorTypes';

export function useTodayGoal() {
  const { actor, isFetching } = useActor();

  return useQuery<Goal | null>({
    queryKey: ['todayGoal'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getTodayGoal();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
