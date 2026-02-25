import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

/**
 * Fetches all chapters from the backend and filters by subjectName.
 * Uses the real backendInterface actor (getChapters returns all chapters).
 * Returns an empty array gracefully on error or when no chapters exist.
 */
export function useChapters(subjectName?: string) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['chapters', subjectName ?? ''],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const allChapters = await actor.getChapters();
        if (!allChapters) return [];
        if (subjectName) {
          return allChapters.filter((c) => c.subjectName === subjectName);
        }
        return allChapters;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}
