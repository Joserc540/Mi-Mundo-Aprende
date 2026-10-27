import type {
  AnalyticsEvent,
  AnalyticsEventType,
  ChildProfile,
} from '../types/domain';

const STORAGE_KEY = 'mundo-events';

type EventMetadata = Record<string, string | number | boolean | null>;

function readEvents(): AnalyticsEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AnalyticsEvent[]) : [];
  } catch {
    return [];
  }
}

export function trackEvent(
  type: AnalyticsEventType,
  profile: Pick<ChildProfile, 'id'> | null,
  metadata: EventMetadata = {},
): void {
  const event: AnalyticsEvent = {
    type,
    child_id: profile?.id || null,
    metadata,
    created_at: new Date().toISOString(),
  };
  const events = [...readEvents(), event].slice(-500);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
