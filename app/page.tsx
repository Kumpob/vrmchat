"use client";

import { useState, useRef } from "react";

import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";

import VRMAvatar from "@/components/VRMAvatar";

import { ktts } from "@/components/kokoroTTS";

export default function Page() {
  const [started, setStarted] = useState(false);

  const [text, setText] = useState("");
  const recognitionRef = useRef(null);

  const [audioUrl, setAudioUrl] = useState("");

  const [stopIdle, setStopIdle] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: { results: { transcript: any }[][] }) => {
      const transcript = event.results[0][0].transcript;
      setText((prev) => prev + " " + transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const start_tts = async () => {
    if (text.trim() == "") {
      console.log("no text");
      return;
    }
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

    //   const audio = new Audio(audioUrl);
    // audio.play();
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
      {/* 3D CANVAS */}
      <Canvas camera={{ position: [0, 1.4, 3] }}>
        <ambientLight intensity={1} />

        <directionalLight position={[2, 2, 2]} intensity={2} />

        <VRMAvatar started={started} audioUrl={audioUrl} stopIdle={stopIdle} />

        <OrbitControls />
      </Canvas>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 m-4 gap-2 flex items-center">
        <button
          onClick={startListening}
          className="bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600"
        >
          🎤
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
