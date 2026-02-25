import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function useQuestionPaperPdf(name: string | null) {
  const { actor, isFetching } = useActor();

  const query = useQuery<Uint8Array | null>({
    queryKey: ['questionPaperPdf', name],
    queryFn: async () => {
      if (!actor || !name) return null;
      try {
        return await (actor as unknown as ExtendedActor).getQuestionPaperPdf(name);
      } catch (err) {
        console.warn('useQuestionPaperPdf: could not fetch PDF', err);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!name,
    retry: false,
  });

  return {
    pdfData: query.data ?? null,
    isLoading: isFetching || query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
