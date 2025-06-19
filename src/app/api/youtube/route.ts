import { NextResponse } from 'next/server';
import Youtube from 'youtube-sr';

interface Song {
  id: string;
  title: string;
  artist: string;
}

const moodSearchQueries: Record<string, string[]> = {
  happy: [
    "Kala Chashma",
    "Ghungroo",
    "Aankh Marey",
  ],
  sad: [
    "Tujhe Kitna Chahne Lage",
    "Channa Mereya",
    "Agar Tum Saath Ho",
  ],
  angry: [
    "Apna Time Aayega",
    "Sher Aaya Sher",
    "Jee Karda",
  ],
  fearful: [
    "Saathiya - Title Track",
    "Lag ja gale",
    "Aaja Nachle",
  ],
  neutral: [
    "Dil Chahta Hai",
    "Iktara",
    "Phir Se Ud Chala",
  ],
  surprised: [
    "Malhari",
    "Tattad Tattad",
    "Mauja Hi Mauja",
  ],
};

async function getYouTubeUrl(songTitle: string): Promise<Song | null> {
  try {
    const searchQuery = `${songTitle} Indian song`;
    const video = await Youtube.searchOne(searchQuery, 'video');

    if (video && video.id) {
      return {
        id: video.id,
        title: video.title || 'Unknown Title',
        artist: video.channel?.name || 'Unknown Artist',
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching song "${songTitle}":`, error);
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mood = searchParams.get('mood');

  if (!mood || !moodSearchQueries[mood]) {
    return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
  }

  const queries = moodSearchQueries[mood];
  const songs = await Promise.all(
    queries.map(query => getYouTubeUrl(query))
  );

  const filteredSongs = songs.filter((song): song is Song => song !== null);
  
  return NextResponse.json(filteredSongs);
} 