# VRMChat

A browser-based 3D AI chatbot that renders a VRM avatar with voice conversation, lip-sync, and animations.

## Features

- **3D VRM Avatar** — Loads and displays VRM 3D models with Three.js and @pixiv/three-vrm
- **AI Chat** — Connects to any OpenAI-compatible chat API for conversational responses
- **Text-to-Speech** — Client-side TTS via Kokoro (82M ONNX model running in a Web Worker) with 28 voices and adjustable speed
- **Speech-to-Text** — Voice input using the browser's built-in SpeechRecognition API
- **Lip Sync** — Real-time audio analysis maps volume to the avatar's mouth movements
- **Idle Animations** — Automatic random animations (texting, looking around) after 10s of inactivity
- **Eye Blinking** — Natural random eye-blink animation
- **Customizable Profiles** — Configure bot name, personality, user name, pronouns, and descriptions
- **Contextual Awareness** — System prompt injects current time, day, and season
- **Chat History** — Persistent conversation history with message editing, stored in localStorage
- **Settings UI** — Modal-based configuration for API, character, user, and TTS settings

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | Tailwind CSS v4 |
| 3D | Three.js, @react-three/fiber, @pixiv/three-vrm |
| TTS | kokoro-js (Kokoro-82M-ONNX, quantized q8) |
| Linting | ESLint 9 |

## Getting Started

### Prerequisites

- Node.js (compatible with Next.js 16)
- npm, yarn, pnpm, or bun

### Installation

```bash
git clone https://github.com/Kumpob/vrmchat.git
cd vrmchat
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Usage

1. Open the app and click the **gear icon** (top right) to open Settings.
2. In the **AI** tab, configure:
   - **API Endpoint** — Your OpenAI-compatible `/v1/chat/completions` URL
   - **API Key** — Your API key
   - **API Model** — Model name (e.g. `gpt-4o`)
   - **System Prompt** — Instructions for the AI's behavior
3. Optionally configure:
   - **Character** tab — Bot name and personality
   - **User** tab — Your name, description, and pronouns
   - **TTS** voice and playback speed in the AI tab
4. Type a message or click the microphone to speak. The avatar will respond with voice and lip movement.

## Project Structure

```
app/
├── layout.tsx          # Root layout with fonts and metadata
├── page.tsx            # Main application (chat UI, 3D canvas, state)
└── globals.css         # Global styles (Tailwind + CSS variables)

components/
├── VRMAvatar.tsx       # 3D avatar rendering, animations, lip-sync
├── aiResponse.ts       # OpenAI-compatible API client
├── kokoroTTS.ts        # TTS engine wrapper
├── tts.worker.ts       # Web Worker for TTS inference
├── voiceList.ts        # Available Kokoro voices
├── interfaces.ts       # Chat message types
├── SettingModal.tsx     # Settings modal (AI, Character, User tabs)
├── historyModal.tsx     # Chat history viewer/editor
├── EditMessageModal.tsx # Message editor modal
├── loadMixamoAnimation.js  # Mixamo FBX → VRM animation converter
└── mixamoVRMRigMap.js      # Mixamo → VRM bone mapping

public/
├── avatar.vrm          # Default VRM avatar model
├── idle.fbx            # Idle animation
├── texting.fbx         # Texting animation
├── looking.fbx         # Looking around animation
└── phone.glb           # 3D phone prop
```

## Custom Avatar

Replace `public/avatar.vrm` with your own VRM model. The animations and lip-sync will work with any VRM 0.x or 1.0 humanoid avatar.

## License

[MIT](LICENSE) — Copyright 2026 Kumpob
