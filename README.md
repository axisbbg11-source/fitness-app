# FitCoach AI

An AI-powered fitness coaching app built with React + Vite. Uses MediaPipe for real-time pose detection and range-based voice coaching.

## Features
- Real-time pose detection via MediaPipe
- 150+ exercises across Home, Gym, Yoga, Cardio, Stretch, Strength
- Range-based AI voice coach (Premium)
- Rep counting with angle tracking
- Calorie tracking
- Daily targets, streaks, weekly progress
- Diet plan generator and food analyzer
- Firebase authentication

## Project Structure
```
src/
├── Dashboard.jsx        # Main app component
├── useVoiceCoach.js     # Voice coach React hook
├── voiceCoaching.js     # Exercise voice configs
├── AuthContext.jsx      # Firebase auth
├── components.jsx       # ParticleBackground
└── data/
    └── exercises.js     # Exercise definitions
```

## Setup
```bash
npm install
npm run dev
```

## Environment Variables
Create a `.env` file:
```
VITE_OPENROUTER_KEY=your_key_here
```

## Tech Stack
- React 18 + Vite
- MediaPipe Pose (CDN)
- Firebase Auth
- TailwindCSS
- Lucide React icons
- OpenRouter AI (diet plans)