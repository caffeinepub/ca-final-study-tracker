import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Subject } from '../lib/actorTypes';
import type { ExtendedActor } from '../lib/actorTypes';

export function useSubjects() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!actor) return [];
      const extActor = actor as unknown as ExtendedActor;
      return extActor.getSubjects();
    },
    enabled: !!actor && !isFetching && !!identity,
  });

  return {
    subjects: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
