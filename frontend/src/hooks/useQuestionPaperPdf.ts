import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export function useQuestionPaperPdf(name: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Uint8Array | null>({
    queryKey: ['questionPaperPdf', name],
    queryFn: async () => {
      if (!actor || !name) return null;
      try {
        const extActor = actor as unknown as ExtendedActor;
        const papers = await extActor.getQuestionPapers();
        const paper = papers.find((p) => p.name === name);
        return paper ? paper.pdfBlob : null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!name,
  });
}
