// API types
export interface Session {
  session_id: string;
  thumb_path: string;
  created_at: string;
}

export interface EventData {
  sessions: Session[];
}

export interface Asset {
  path: string;
  kind: 'video' | 'strip_video' | 'image';
}

export interface SessionManifest {
  assets: Asset[];
}

// API base URL - should be configurable via environment variables
const API_BASE_URL = 'http://localhost:3000/api';

// API functions
export async function getEvent(eventId: string): Promise<EventData> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch event ${eventId}`);
  }
  return response.json();
}

export async function getSessionManifest(sessionId: string): Promise<SessionManifest> {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}/manifest`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session manifest ${sessionId}`);
  }
  return response.json();
}

export function assetUrl(path: string): string {
  return `${API_BASE_URL}/assets/${path}`;
}
