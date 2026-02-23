import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

interface Chapter {
  name: string;
  subjectName: string;
  totalTopics: bigint;
  completedTopics: bigint;
  notesPdf: Uint8Array | null;
}

export function useChapters(subjectName: string) {
  const { actor, isFetching } = useActor();

  const query = useQuery<Chapter[]>({
    queryKey: ['chapters', subjectName],
    queryFn: async () => {
      if (!actor) return [];
      // Backend doesn't have a getChaptersBySubject method, so we need to get all chapters
      // and filter client-side. For now, return empty array as backend needs extension.
      // This is a limitation that should be documented in backend-gaps.
      return [];
    },
    enabled: !!actor && !isFetching && !!subjectName,
  });

  return {
    chapters: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
