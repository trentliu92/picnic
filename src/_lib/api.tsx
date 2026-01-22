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

export interface Strip {
  kind: 'strip_photo' | 'strip_video';
  url: string;
  path: string;
  poster_url: string | null;
}

export interface SessionStripsResponse {
  session_id: string;
  event_id: number;
  created_at: string;
  strips: Strip[];
}

export interface EventThumbnail {
  session_id: string;
  created_at: string;
  url: string;
}

export interface EventThumbnailsResponse {
  event_id: number;
  updated_at: string;
  thumbnails: EventThumbnail[];
  next_cursor: string | null;
  has_more: boolean;
}

// API base URL - uses proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : 'https://id8.events/api';
  
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

/**
 * Fetches the strips (photo and video) for a session
 */
export async function getSessionStrips(sessionId: string): Promise<SessionStripsResponse> {
  const response = await fetch(`${API_BASE_URL}/s/${sessionId}/strips`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session strips ${sessionId}`);
  }
  return response.json();
}

/**
 * Fetches thumbnail previews for sessions in an event
 */
export async function getEventThumbnails(eventId: string, limit = 10): Promise<EventThumbnailsResponse> {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/thumbnails?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch event thumbnails ${eventId}`);
  }
  return response.json();
}
