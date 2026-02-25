import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { QuestionPaperMeta, ExtendedActor } from '../lib/actorTypes';

export function useQuestionPapers() {
  const { actor, isFetching } = useActor();

  const query = useQuery<QuestionPaperMeta[]>({
    queryKey: ['questionPapers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await (actor as unknown as ExtendedActor).getAllQuestionPapers();
      } catch (err) {
        console.warn('useQuestionPapers: could not fetch question papers', err);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });

  return {
    papers: query.data ?? [],
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
