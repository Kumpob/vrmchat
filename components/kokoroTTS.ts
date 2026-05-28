import { KokoroTTS } from "kokoro-js";
import { voiceList } from "./voiceList";

let tts: KokoroTTS | null = null;

export async function getTTS() {
  if (!tts) {
    tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-ONNX", {
      dtype: "q8",
    });
  }

  return tts;
}

export async function ktts(text: string, voice: voiceList, speed: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./tts.worker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (e: MessageEvent<{ blob: Blob }>) => {
      const url = URL.createObjectURL(e.data.blob);
      worker.terminate(); // clean up after done
      resolve(url);
    };

    worker.onerror = (err) => {
      worker.terminate();
      reject(err);
    };

    worker.postMessage({ text, voice, speed });
  });
}
