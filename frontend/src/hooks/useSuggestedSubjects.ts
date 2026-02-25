import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useSubjects } from './useSubjects';

export function useSuggestedSubjects() {
  const { actor, isFetching } = useActor();
  const { subjects } = useSubjects();

  return useQuery<string[]>({
    queryKey: ['suggestedSubjects'],
    queryFn: async () => {
      if (!subjects || subjects.length === 0) return [];
      // Return subjects as suggestions
      return subjects.map((s) => s.name).slice(0, 3);
    },
    enabled: !!actor && !isFetching,
  });
}
