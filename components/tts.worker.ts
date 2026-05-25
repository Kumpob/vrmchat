import { getTTS } from "./kokoroTTS";

self.onmessage = async (e: MessageEvent<{ text: string }>) => {
  const { text } = e.data;

  const model = await getTTS();
  const audio = await model.generate(text, {
    voice: "af_bella",
    speed: 1.2,
  });

  const blob = await audio.toBlob();
  // Transfer the blob back to the main thread
  self.postMessage({ blob });
};
