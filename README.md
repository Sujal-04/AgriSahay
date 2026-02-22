# 🌾 AgriSahay

AI-powered platform helping farmers discover government schemes they're eligible for.

## Features

- Farmer profile registration
- AI-powered scheme recommendations
- Multilingual support (English, Hindi, Marathi)
- Conversational chat interface
- Voice input & text-to-speech
- Offline-ready with local storage
- Mobile-friendly design

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+

### Installation

```bash
git clone https://github.com/Sujal-04/agrisahay.git
cd agrisahay
npm install
```

### Run Development Server

```bash
npm run dev
```

App runs at http://localhost:8080

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Profile** - Fill your farming details at `/profile`
2. **Recommendations** - View matched schemes at `/recommendations`
3. **Chat** - Ask questions in your language at `/chat`
4. **Voice** - Use microphone for voice input
5. **Language** - Switch between EN | हिं | मरा

## Tech Stack

- React + TypeScript + Vite
- shadcn/ui + Tailwind CSS
- React Router + TanStack Query
- Web Speech API

## License

MIT
