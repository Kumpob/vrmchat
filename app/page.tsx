"use client";

import { useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import VRMAvatar from "@/components/VRMAvatar";
import { ktts } from "@/components/kokoroTTS";

type SpeechRecognitionType = {
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onstart?: () => void;
  onend?: () => void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
};

export default function Page() {
  const [started, setStarted] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [stopIdle, setStopIdle] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
      recognitionRef.current?.stop();
    };

    recognition.onresult = (event: { results: { transcript: any }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const start_tts = async () => {
    if (text.trim() == "") {
      console.log("no text");
      return;
    }

    try {
      setLoading(true); // START loading

      const text2 = text.trim();
      setText("");
      setStopIdle(true);

      console.log("saying:", text2);
      console.time("myFunction");
      const url = await ktts(text2);

      console.log("got url", url);

      setAudioUrl(url);
      setStarted(true);
      console.timeEnd("myFunction");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // STOP loading
    }
  };

  const on_audio_end = () => {
    setStopIdle(false);
    console.log("audio ended");
  };

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        background: "#111",
        position: "relative",
      }}
    >
      {/* LOADING SPINNER */}
      {(loading || listening) && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center">
          {loading && (
            <>
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-xs mt-2">Generating...</p>
            </>
          )}

          {!loading && listening && (
            <>
              <div className="w-10 h-10 flex items-center justify-center">
                {/* mic pulse */}
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40" />
                  <div className="relative w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    🎤
                  </div>
                </div>
              </div>
              <p className="text-white text-xs mt-2">Listening...</p>
            </>
          )}
        </div>
      )}

      {/* 3D CANVAS */}
      <Canvas camera={{ position: [0, 1.4, 3] }}>
        <ambientLight intensity={1} />
        <directionalLight position={[2, 2, 2]} intensity={2} />

        <VRMAvatar
          started={started}
          audioUrl={audioUrl}
          stopIdle={stopIdle}
          onAudioEnd={on_audio_end}
        />

        <OrbitControls />
      </Canvas>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 m-4 gap-2 flex items-center">
        <button
          onClick={listening ? stopListening : startListening}
          className="bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600"
        >
          {listening ? "🛑" : "🎤"}
        </button>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or speak..."
          className="flex-1 bg-white text-black rounded-2xl p-4 outline-none resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              start_tts();
            }
          }}
        />

        <button
          onClick={start_tts}
          className="bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600"
        >
          📤
        </button>
      </div>
    </main>
  );
}
