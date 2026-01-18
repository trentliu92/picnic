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
  type: 'photo' | 'video' | 'strip_photo' | 'strip_video';
  src: string;
  poster: string | null;
}

export interface SessionManifest {
  assets: Asset[];
}

// API base URL - uses proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://fotox-worker.id8-photobooth.workers.dev';
  
// API functions
export async function getEvent(eventId: string): Promise<EventData> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch event ${eventId}`);
  }
  return response.json();
}

export async function getSessionManifest(sessionId: string): Promise<SessionManifest> {
  const response = await fetch(`${API_BASE_URL}/s/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session manifest ${sessionId}`);
  }
  
  // The endpoint returns HTML with embedded JSON in window.GALLERY_ASSETS
  const html = await response.text();
  const match = html.match(/window\.GALLERY_ASSETS\s*=\s*(\[[\s\S]*?\]);/);
  
  if (!match) {
    throw new Error(`Failed to parse session manifest from HTML`);
  }
  
  const assets: Asset[] = JSON.parse(match[1]);
  return { assets };
}

export function assetUrl(path: string): string {
  return `${API_BASE_URL}/assets/${path}`;
}
