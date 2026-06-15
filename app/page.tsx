"use client";

import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import VRMAvatar from "@/components/VRMAvatar";
import { ktts } from "@/components/kokoroTTS";
import { aiResponse } from "@/components/aiResponse";
import SettingModal from "@/components/SettingModal";
import { chatMessage } from "@/components/interfaces";
import { voiceList } from "@/components/voiceList";
import HistoryModal from "@/components/historyModal";
import ModelModal from "@/components/ModelModal";

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
  const [subtitle, setSubtitle] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [settingModal, setSettingModal] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);

  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiModel, setApiModel] = useState("");
  const [apiPrompt, setApiPrompt] = useState("You are a chatbot.");

  const [botName, setBotName] = useState("Kokoro");
  const [botPersonality, setBotPersonality] = useState("");
  const [yourName, setYourName] = useState("User");
  const [yourPersonality, setYourPersonality] = useState("");
  const [yourPronouns1, setYourPronouns1] = useState("");
  const [yourPronouns2, setYourPronouns2] = useState("");
  const [yourPronouns3, setYourPronouns3] = useState("");

  const [chatHistory, setChatHistory] = useState<chatMessage[]>([]);

  const [voice, setVoice] = useState<voiceList>("af_bella");
  const [speed, setSpeed] = useState(1.2);

  const [includeTime, setIncludeTime] = useState(true);

  const [vrmUrl, setVrmUrl] = useState("/avatar.vrm");
  const vrmInputRef = useRef<HTMLInputElement>(null);
  const vrmObjectUrlRef = useRef<string | null>(null);

  const [modelModal, setModelModal] = useState(false);
  const [modelPosX, setModelPosX] = useState(0);
  const [modelPosY, setModelPosY] = useState(-1);
  const [modelPosZ, setModelPosZ] = useState(0);
  const [modelRotY, setModelRotY] = useState(0);
  const [leftArmZ, setLeftArmZ] = useState(-0.2);
  const [rightArmZ, setRightArmZ] = useState(0.2);
  const [leftThumbX, setLeftThumbX] = useState(-0.35);
  const [rightThumbX, setRightThumbX] = useState(-0.35);

  const resetPose = () => {
    setModelPosX(0);
    setModelPosY(0.15);
    setModelPosZ(2.3);
    setModelRotY(0);
    setLeftArmZ(-0.2);
    setRightArmZ(0.2);
    setLeftThumbX(-0.35);
    setRightThumbX(-0.35);
  };

  const resetAvatar = () => {
    if (vrmObjectUrlRef.current) {
      URL.revokeObjectURL(vrmObjectUrlRef.current);
      vrmObjectUrlRef.current = null;
    }
    setVrmUrl("/avatar.vrm");
    resetPose();
  };

  //save and load api local storage
  useEffect(() => {
    const savedApiEndpoint = localStorage.getItem("apiEndpoint");
    if (savedApiEndpoint) {
      setApiEndpoint(savedApiEndpoint);
    }
    const savedApiKey = localStorage.getItem("apiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    const savedApiModel = localStorage.getItem("apiModel");
    if (savedApiModel) {
      setApiModel(savedApiModel);
    }
    const savedApiPrompt = localStorage.getItem("apiPrompt");
    if (savedApiPrompt) {
      setApiPrompt(savedApiPrompt);
    }
    const savedBotName = localStorage.getItem("botName");
    if (savedBotName) {
      setBotName(savedBotName);
    }
    const savedBotPersonality = localStorage.getItem("botPersonality");
    if (savedBotPersonality) {
      setBotPersonality(savedBotPersonality);
    }
    const savedYourName = localStorage.getItem("yourName");
    if (savedYourName) {
      setYourName(savedYourName);
    }
    const savedYourPersonality = localStorage.getItem("yourPersonality");
    if (savedYourPersonality) {
      setYourPersonality(savedYourPersonality);
    }
    const savedYourPronouns1 = localStorage.getItem("yourPronouns1");
    if (savedYourPronouns1) {
      setYourPronouns1(savedYourPronouns1);
    }
    const savedYourPronouns2 = localStorage.getItem("yourPronouns2");
    if (savedYourPronouns2) {
      setYourPronouns2(savedYourPronouns2);
    }
    const savedYourPronouns3 = localStorage.getItem("yourPronouns3");
    if (savedYourPronouns3) {
      setYourPronouns3(savedYourPronouns3);
    }

    const savedChatHistory = localStorage.getItem("chatHistory");
    if (savedChatHistory) {
      setChatHistory(JSON.parse(savedChatHistory));
    }

    const savedVoice = localStorage.getItem("voice");
    if (savedVoice) {
      setVoice(savedVoice as voiceList);
    }
    const savedSpeed = localStorage.getItem("speed");
    if (savedSpeed) {
      setSpeed(parseFloat(savedSpeed));
    }

    const savedIncludeTime = localStorage.getItem("includeTime");
    if (savedIncludeTime) {
      setIncludeTime(savedIncludeTime === "true");
    }

    const savedModelPosX = localStorage.getItem("modelPosX");
    if (savedModelPosX) setModelPosX(parseFloat(savedModelPosX));
    const savedModelPosY = localStorage.getItem("modelPosY");
    if (savedModelPosY) setModelPosY(parseFloat(savedModelPosY));
    const savedModelPosZ = localStorage.getItem("modelPosZ");
    if (savedModelPosZ) setModelPosZ(parseFloat(savedModelPosZ));
    const savedModelRotY = localStorage.getItem("modelRotY");
    if (savedModelRotY) setModelRotY(parseFloat(savedModelRotY));
    const savedLeftArmZ = localStorage.getItem("leftArmZ");
    if (savedLeftArmZ) setLeftArmZ(parseFloat(savedLeftArmZ));
    const savedRightArmZ = localStorage.getItem("rightArmZ");
    if (savedRightArmZ) setRightArmZ(parseFloat(savedRightArmZ));
    const savedLeftThumbX = localStorage.getItem("leftThumbX");
    if (savedLeftThumbX) setLeftThumbX(parseFloat(savedLeftThumbX));
    const savedRightThumbX = localStorage.getItem("rightThumbX");
    if (savedRightThumbX) setRightThumbX(parseFloat(savedRightThumbX));
  }, []);

  useEffect(() => {
    localStorage.setItem("apiEndpoint", apiEndpoint);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiModel", apiModel);
    localStorage.setItem("apiPrompt", apiPrompt);
    localStorage.setItem("botName", botName);
    localStorage.setItem("botPersonality", botPersonality);
    localStorage.setItem("yourName", yourName);
    localStorage.setItem("yourPersonality", yourPersonality);
    localStorage.setItem("yourPronouns1", yourPronouns1);
    localStorage.setItem("yourPronouns2", yourPronouns2);
    localStorage.setItem("yourPronouns3", yourPronouns3);
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    localStorage.setItem("voice", voice);
    localStorage.setItem("speed", speed.toString());
    localStorage.setItem("includeTime", includeTime.toString());
    localStorage.setItem("modelPosX", modelPosX.toString());
    localStorage.setItem("modelPosY", modelPosY.toString());
    localStorage.setItem("modelPosZ", modelPosZ.toString());
    localStorage.setItem("modelRotY", modelRotY.toString());
    localStorage.setItem("leftArmZ", leftArmZ.toString());
    localStorage.setItem("rightArmZ", rightArmZ.toString());
    localStorage.setItem("leftThumbX", leftThumbX.toString());
    localStorage.setItem("rightThumbX", rightThumbX.toString());
  }, [
    apiEndpoint,
    apiKey,
    apiModel,
    apiPrompt,
    botPersonality,
    botName,
    yourName,
    yourPersonality,
    yourPronouns1,
    yourPronouns2,
    yourPronouns3,
    chatHistory,
    voice,
    speed,
    includeTime,
    modelPosX,
    modelPosY,
    modelPosZ,
    modelRotY,
    leftArmZ,
    rightArmZ,
    leftThumbX,
    rightThumbX,
  ]);

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

  const timeOfDay = () => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 8) {
      return "Early Morning";
    }
    if (hours >= 8 && hours < 10) {
      return "Morning";
    }
    if (hours >= 10 && hours < 12) {
      return "Late Morning";
    }
    if (hours >= 12 && hours < 17) {
      return "Afternoon";
    }
    if (hours >= 17 && hours < 21) {
      return "Evening";
    }
    if (hours >= 21 && hours < 24) {
      return "Night";
    }
    return "Late Night";
  };

  const dayOfWeek = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[new Date().getDay()];
  };

  const getSeason = () => {
    const month = new Date().getMonth();
    if (month >= 0 && month < 3) {
      return "Winter";
    }
    if (month >= 3 && month < 6) {
      return "Spring";
    }
    if (month >= 6 && month < 9) {
      return "Summer";
    }
    if (month >= 9 && month < 12) {
      return "Fall";
    }
    return "Winter";
  };
  const start_tts = async () => {
    if (text.trim() == "") {
      console.log("no text");
      return;
    }

    try {
      setLoading(true);
      console.time("myFunction");
      if (
        !apiEndpoint.trim() ||
        !apiKey.trim() ||
        !apiModel.trim() ||
        !apiPrompt.trim() ||
        !botName.trim() ||
        !yourName.trim()
      ) {
        alert("Please set API in the settings");
        return;
      }
      const updatedHistory: chatMessage[] = [
        ...chatHistory,
        { role: "user", content: text.trim() },
      ];
      let systemPrompt = apiPrompt;

      if (includeTime) {
        systemPrompt += `\n\n<time>Day of Week: ${dayOfWeek()}\n\nTime: ${new Date().toLocaleTimeString()}\n\nTime of Day: ${timeOfDay()}\n\nSeason: ${getSeason()}</time>`;
      }

      systemPrompt += `\n\n<${botName}>Character Name:` + botName;
      if (botPersonality.trim()) {
        systemPrompt += "\n\nCharacter Personality:" + botPersonality;
      }
      systemPrompt += `</${botName}>`;

      systemPrompt += `\n\n<${yourName}>User Name:` + yourName;
      if (yourPersonality.trim()) {
        systemPrompt += "\n\nUser Description:" + yourPersonality;
      }
      if (
        yourPronouns1.trim() ||
        yourPronouns2.trim() ||
        yourPronouns3.trim()
      ) {
        systemPrompt += `\n\nUser Pronouns: ${yourPronouns1}/${yourPronouns2}/${yourPronouns3}`;
      }
      systemPrompt += `</${yourName}>\n\n`;
      console.log("prompt:", systemPrompt);
      const text2 = await aiResponse(
        updatedHistory,
        apiEndpoint,
        apiKey,
        apiModel,
        systemPrompt,
      );
      const finalHistory: chatMessage[] = [
        ...updatedHistory,
        { role: "assistant", content: text2.trim() },
      ];
      setChatHistory(finalHistory);
      setText("");
      setStopIdle(true);

      console.log("saying:", text2);
      const url = await ktts(text2, voice, speed);

      setAudioUrl(url);
      setStarted(true);
      setSubtitle(text2);
      setIsSpeaking(true);
    } catch (err) {
      console.error(err);
    } finally {
      console.timeEnd("myFunction");
      setLoading(false);
    }
  };

  const on_audio_end = () => {
    setStopIdle(false);
    setSubtitle("");
    setIsSpeaking(false);
    console.log("audio ended");
  };

  const handleVrmFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (vrmObjectUrlRef.current) {
      URL.revokeObjectURL(vrmObjectUrlRef.current);
    }
    const url = URL.createObjectURL(file);
    vrmObjectUrlRef.current = url;
    setVrmUrl(url);
    e.target.value = "";
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
      <input
        ref={vrmInputRef}
        type="file"
        accept=".vrm"
        className="hidden"
        onChange={handleVrmFile}
      />

      <div className="absolute top-4 left-4 z-50">
        <div className="relative">
          <button
            onClick={() => vrmInputRef.current?.click()}
            className="hover:scale-240 scale-200 m-4"
          >
            🧍
          </button>
          <button
            onClick={() => setModelModal(!modelModal)}
            className="hover:scale-240 scale-200 m-4"
          >
            🎛️
          </button>
          {modelModal && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setModelModal(false)}
              />
              <ModelModal
                setOpen={setModelModal}
                modelPosX={modelPosX}
                setModelPosX={setModelPosX}
                modelPosY={modelPosY}
                setModelPosY={setModelPosY}
                modelPosZ={modelPosZ}
                setModelPosZ={setModelPosZ}
                modelRotY={modelRotY}
                setModelRotY={setModelRotY}
                leftArmZ={leftArmZ}
                setLeftArmZ={setLeftArmZ}
                rightArmZ={rightArmZ}
                setRightArmZ={setRightArmZ}
                leftThumbX={leftThumbX}
                setLeftThumbX={setLeftThumbX}
                rightThumbX={rightThumbX}
                setRightThumbX={setRightThumbX}
                onResetModel={resetAvatar}
                onResetPose={resetPose}
              />
            </>
          )}
        </div>
      </div>

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

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setHistoryModal(true)}
          className="hover:scale-240 scale-200 m-4"
        >
          🕑
        </button>
        <button
          onClick={() => setSettingModal(true)}
          className="hover:scale-240 scale-200 m-4"
        >
          ⚙️
        </button>
      </div>

      {settingModal && (
        <SettingModal
          apiEndpoint={apiEndpoint}
          setApiEndpoint={setApiEndpoint}
          apiKey={apiKey}
          setApiKey={setApiKey}
          apiModel={apiModel}
          setApiModel={setApiModel}
          apiPrompt={apiPrompt}
          setApiPrompt={setApiPrompt}
          setSettingModal={setSettingModal}
          botName={botName}
          setBotName={setBotName}
          botPersonality={botPersonality}
          setBotPersonality={setBotPersonality}
          yourName={yourName}
          setYourName={setYourName}
          yourPersonality={yourPersonality}
          setYourPersonality={setYourPersonality}
          yourPronouns1={yourPronouns1}
          setYourPronouns1={setYourPronouns1}
          yourPronouns2={yourPronouns2}
          setYourPronouns2={setYourPronouns2}
          yourPronouns3={yourPronouns3}
          setYourPronouns3={setYourPronouns3}
          setChatHistory={setChatHistory}
          setHistoryModal={setHistoryModal}
          voice={voice}
          setVoice={setVoice}
          speed={speed}
          setSpeed={setSpeed}
          includeTime={includeTime}
          setIncludeTime={setIncludeTime}
        />
      )}

      {historyModal && (
        <HistoryModal
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          characterName={botName}
          userName={yourName}
          setHistoryModal={setHistoryModal}
        />
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
          vrmUrl={vrmUrl}
          modelPosX={modelPosX}
          modelPosY={modelPosY}
          modelPosZ={modelPosZ}
          modelRotY={modelRotY}
          leftArmZ={leftArmZ}
          rightArmZ={rightArmZ}
          leftThumbX={leftThumbX}
          rightThumbX={rightThumbX}
        />

        <OrbitControls target={[0.03, 0, 0]} enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
      <div className="absolute bottom-1/7 left-1/2 -translate-x-1/2 w-7/8 lg:w-1/2 mb-4 lg:m-4 gap-2 flex items-center justify-center">
        <p className="text-sm bg-black/50 text-center w-full">{subtitle}</p>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full lg:w-1/2 mb-4 lg:m-4 gap-2 flex items-center">
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
