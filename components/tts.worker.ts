import { getTTS } from "./kokoroTTS";
import { voiceList } from "./voiceList";

self.onmessage = async (e: MessageEvent<{ text: string, voice: voiceList, speed: number }>) => {
  const { text, voice, speed } = e.data;

  const model = await getTTS();
  const audio = await model.generate(text, {
    voice: voice,
    speed: speed,
  });

  const blob = await audio.toBlob();
  // Transfer the blob back to the main thread
  self.postMessage({ blob });
};
