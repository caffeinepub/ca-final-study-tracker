import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ExtendedActor } from '../lib/actorTypes';

export interface SessionSummaryEntry {
  key: string;
  value: { content: string };
}

export function useSessionSummaries() {
  const { actor, isFetching } = useActor();

  return useQuery<SessionSummaryEntry[]>({
    queryKey: ['sessionSummaries'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const extActor = actor as unknown as ExtendedActor;
        const sessions = await extActor.getStudySessions();
        return sessions
          .filter((s) => s.topicsCovered && s.topicsCovered.trim().length > 0)
          .map((s, i) => ({
            key: `session-${i}`,
            value: { content: `${s.subject}: ${s.topicsCovered}` },
          }));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
