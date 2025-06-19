export interface Song {
  id: string;
  title: string;
  artist: string;
}

interface SearchOptions {
  mood: string;
}

export async function searchSongs({ mood }: SearchOptions): Promise<Song[]> {
  try {
    const response = await fetch(`/api/youtube?mood=${mood}`);
    if (!response.ok) {
      throw new Error('Failed to fetch songs');
    }
    const songs: Song[] = await response.json();
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
} 