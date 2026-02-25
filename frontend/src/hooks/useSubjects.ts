import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Subject } from '../backend';

export function useSubjects() {
  const { actor, isFetching } = useActor();

  const query = useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getSubjects();
      } catch (err) {
        // Authorization errors (e.g. anonymous caller) should return empty array
        // rather than crashing the UI
        console.warn('useSubjects: could not fetch subjects', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    subjects: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
    error: null, // swallow errors so consumers don't show error screens
    refetch: query.refetch,
  };
}
