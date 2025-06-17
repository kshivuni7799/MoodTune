# MoodTune

MoodTune is a web application that detects user emotions through webcam and plays matching music. It uses face-api.js for emotion detection and provides a seamless music experience based on the user's mood.

## Features

- Real-time emotion detection through webcam
- Dynamic music selection based on detected mood
- Modern and responsive UI
- Privacy-focused (all processing done client-side)

## Technologies Used

- Next.js 13+ with App Router
- TypeScript
- Tailwind CSS
- face-api.js for emotion detection
- TensorFlow.js

## Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Modern web browser with webcam support

## Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repository-url]
   cd MoodTune
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
MoodTune/
├── public/
│   └── models/          # Face detection models
├── src/
│   ├── app/            # Next.js app router pages
│   └── components/     # React components
├── next.config.js      # Next.js configuration
└── package.json        # Project dependencies
```

## Development

The application uses face-api.js for emotion detection. The models are loaded from the `public/models` directory. The main components are:

- `WebcamCapture`: Handles webcam feed and emotion detection
- `MoodDisplay`: Displays detected emotions
- `MusicPlayer`: Plays music based on detected mood

## Deployment

The application can be deployed to any platform that supports Next.js applications (Vercel, Netlify, etc.).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 