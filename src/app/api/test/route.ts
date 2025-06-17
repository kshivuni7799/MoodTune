import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  // Basic validation
  const keyValidation = {
    exists: !!apiKey,
    length: apiKey?.length || 0,
    startsWithAIzaSy: apiKey?.startsWith('AIzaSy') || false,
    firstFour: apiKey?.substring(0, 4) || 'none',
    lastFour: apiKey?.substring(apiKey.length - 4) || 'none'
  };

  // Test the API key with a simple YouTube API request
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&key=${apiKey}`
    );
    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      keyValidation,
      apiResponse: response.ok ? 'Valid API Key' : data.error,
      status: response.status,
      statusText: response.statusText
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      keyValidation,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 