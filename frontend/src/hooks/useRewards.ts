import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Reward, ExtendedActor } from '../lib/actorTypes';

export function useRewards() {
  const { actor, isFetching } = useActor();

  return useQuery<Reward[]>({
    queryKey: ['rewards'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        return await extActor.getRewards();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
