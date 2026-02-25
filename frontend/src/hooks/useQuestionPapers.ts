import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor, QuestionPaperMeta } from '../lib/actorTypes';

export function useQuestionPapers() {
  const { actor, isFetching } = useActor();

  return useQuery<QuestionPaperMeta[]>({
    queryKey: ['questionPapers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        const papers = await extActor.getQuestionPapers();
        return papers.map((p) => ({ name: p.name, uploadDate: p.uploadDate }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
