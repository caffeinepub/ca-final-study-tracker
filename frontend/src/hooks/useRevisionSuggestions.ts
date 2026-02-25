import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useRevisionSchedule } from './useRevisionSchedule';

export function useRevisionSuggestions() {
  const { actor, isFetching } = useActor();
  const { data: revisionTopics } = useRevisionSchedule();

  return useQuery<string[]>({
    queryKey: ['revisionSuggestions'],
    queryFn: async () => {
      if (!revisionTopics) return [];
      // Generate suggestions based on overdue/upcoming topics
      const now = Date.now() * 1_000_000;
      const overdue = revisionTopics
        .filter((t) => !t.isComplete && Number(t.scheduledDate) < now)
        .map((t) => `${t.subject}: ${t.topic}`);
      return overdue.slice(0, 5);
    },
    enabled: !!actor && !isFetching,
  });
}
