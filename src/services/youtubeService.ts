const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

interface SearchParams {
  mood: string;
  language?: string;
}

export interface YouTubeSong {
  title: string;
  artist: string;
  videoId: string;
  thumbnail: string;
}

const moodKeywords: { [key: string]: string[] } = {
  happy: ['happy indian songs', 'bollywood dance songs', 'upbeat hindi songs', 'punjabi bhangra'],
  sad: ['sad hindi songs', 'emotional bollywood songs', 'hindi sad songs', 'bollywood romantic sad'],
  angry: ['powerful hindi songs', 'intense bollywood songs', 'aggressive indian songs'],
  fearful: ['dramatic bollywood songs', 'intense hindi songs', 'suspense indian songs'],
  neutral: ['peaceful hindi songs', 'calm indian songs', 'soothing bollywood'],
  surprised: ['energetic bollywood songs', 'party hindi songs', 'upbeat indian songs']
};

export async function searchSongs({ mood }: SearchParams): Promise<YouTubeSong[]> {
  try {
    // Debug: Log the API key length and first/last 4 characters
    if (!YOUTUBE_API_KEY) {
      console.error('API key is missing');
      throw new Error('YouTube API key is not configured. Please check your .env.local file.');
    }

    console.log('API Key validation:', {
      length: YOUTUBE_API_KEY.length,
      startsWithAIzaSy: YOUTUBE_API_KEY.startsWith('AIzaSy'),
      firstFour: YOUTUBE_API_KEY.substring(0, 4),
      lastFour: YOUTUBE_API_KEY.substring(YOUTUBE_API_KEY.length - 4)
    });

    // Get random keyword for the mood
    const keywords = moodKeywords[mood.toLowerCase()] || moodKeywords.neutral;
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    console.log('Searching with keyword:', randomKeyword);

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(
      randomKeyword
    )}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`;

    console.log('Making API request...');
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Log detailed error information
    if (!response.ok) {
      console.error('YouTube API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error,
        errorMessage: data.error?.message,
        errorReason: data.error?.errors?.[0]?.reason,
        errorDomain: data.error?.errors?.[0]?.domain
      });
      throw new Error(`YouTube API Error: ${data.error?.message || 'Unknown error'}`);
    }

    // Validate response data
    if (!data.items || !Array.isArray(data.items)) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from YouTube API');
    }

    console.log(`Found ${data.items.length} songs`);

    return data.items.map((item: any) => ({
      title: item.snippet.title,
      artist: item.snippet.channelTitle,
      videoId: item.id.videoId,
      thumbnail: item.snippet.thumbnails.medium.url
    }));
  } catch (error) {
    console.error('Error in searchSongs:', error);
    throw error;
  }
} 