import { chatMessage } from "./interfaces";
import { useState } from "react";
import { voiceList, voices } from "./voiceList";
import { ktts } from "./kokoroTTS";

type SettingModalProps = {
  apiEndpoint: string;
  setApiEndpoint: React.Dispatch<React.SetStateAction<string>>;

  apiKey: string;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;

  apiModel: string;
  setApiModel: React.Dispatch<React.SetStateAction<string>>;

  apiPrompt: string;
  setApiPrompt: React.Dispatch<React.SetStateAction<string>>;

  setSettingModal: React.Dispatch<React.SetStateAction<boolean>>;

  botName: string;
  setBotName: React.Dispatch<React.SetStateAction<string>>;

  botPersonality: string;
  setBotPersonality: React.Dispatch<React.SetStateAction<string>>;

  yourName: string;
  setYourName: React.Dispatch<React.SetStateAction<string>>;

  yourPersonality: string;
  setYourPersonality: React.Dispatch<React.SetStateAction<string>>;

  setChatHistory: React.Dispatch<React.SetStateAction<chatMessage[]>>;

  voice: voiceList;
  setVoice: React.Dispatch<React.SetStateAction<voiceList>>;
  speed: number;
  setSpeed: React.Dispatch<React.SetStateAction<number>>;
};

export default function SettingModal({
  apiEndpoint,
  setApiEndpoint,
  apiKey,
  setApiKey,
  apiModel,
  setApiModel,
  apiPrompt,
  setApiPrompt,
  setSettingModal,
  botName,
  setBotName,
  botPersonality,
  setBotPersonality,
  yourName,
  setYourName,
  yourPersonality,
  setYourPersonality,
  setChatHistory,
  voice,
  setVoice,
  speed,
  setSpeed,
}: SettingModalProps) {
  const [settingTabs, setSettingTabs] = useState<
    "AI" | "Character" | "User" | "Chat"
  >("AI");
  const [isLoading, setLoading] = useState(false);
  function clearChatHistory() {
    setChatHistory([]);
  }
  const previewTTS = async () => {
    setLoading(true);
    const url = await ktts("This is a preview", voice, speed);
    const audio = new Audio(url);
    audio.onended = () => setLoading(false);
    audio.play();
  };
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={() => setSettingModal(false)}
    >
      <div
        className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 px-4 rounded-lg w-full h-6/7 max-h-md max-w-md overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-stone-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-stone-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="sticky top-0 z-10 flex justify-between text-lg font-semibold mb-4 bg-white dark:bg-neutral-800 py-2">
          <div>Settings</div>
          <button onClick={() => setSettingModal(false)}>❌</button>
        </h2>
        <div className="flex justify-between mb-4">
          <div className="grid grid-cols-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                settingTabs === "AI" ? "bg-gray-200 dark:bg-neutral-700" : ""
              }`}
              onClick={() => setSettingTabs("AI")}
            >
              AI
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                settingTabs === "Character"
                  ? "bg-gray-200 dark:bg-neutral-700"
                  : ""
              }`}
              onClick={() => setSettingTabs("Character")}
            >
              Character
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                settingTabs === "User" ? "bg-gray-200 dark:bg-neutral-700" : ""
              }`}
              onClick={() => setSettingTabs("User")}
            >
              User
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                settingTabs === "Chat" ? "bg-gray-200 dark:bg-neutral-700" : ""
              }`}
              onClick={() => setSettingTabs("Chat")}
            >
              Chat
            </button>
          </div>
        </div>

        {settingTabs === "AI" && (
          <>
            <div className="bg-gray-100 dark:bg-neutral-600 p-2 rounded-lg mb-4">
              <p className="font-semibold">API</p>
              <div className="mb-4">
                <label className="block text-sm font-medium ">
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">API Model</label>
                <input
                  type="text"
                  value={apiModel}
                  onChange={(e) => setApiModel(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium ">
                  System Prompt
                </label>
                <textarea
                  value={apiPrompt}
                  onChange={(e) => setApiPrompt(e.target.value)}
                  className="mt-1 p-2 border rounded w-full"
                  placeholder="Enter the System prompt."
                />
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-neutral-600 p-2 rounded-lg mb-4">
              <p className="font-semibold">Text-To-Speech</p>
              <div className="mb-4">
                <label className="block text-sm font-medium ">Voice</label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value as voiceList)}
                  className="mt-1 p-2 border rounded w-full dark:bg-neutral-700"
                >
                  {voices.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Speed</label>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <span>0.25</span>
                    <input
                      type="range"
                      min="0.25"
                      max="3"
                      step="0.25"
                      value={speed}
                      onChange={(e) => setSpeed(parseFloat(e.target.value))}
                      className="mt-1 w-full"
                    />
                    <span>3</span>
                  </div>

                  <input
                    type="number"
                    min="0.25"
                    max="3"
                    step="0.25"
                    value={speed}
                    onChange={(e) => {
                      const value = Math.min(
                        3,
                        Math.max(0.25, parseFloat(e.target.value) || 0.25),
                      );
                      setSpeed(value);
                    }}
                    className="mt-1 p-2 border rounded w-20"
                  />
                </div>
              </div>
              <div>
                <button
                  onClick={() => previewTTS()}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full mb-4"
                >
                  {isLoading ? "Generating" : "Preview"}
                </button>
              </div>
            </div>
          </>
        )}

        {settingTabs === "Character" && (
          <div className="bg-gray-100 dark:bg-neutral-600 p-2 rounded-lg mb-4">
            <p className="font-semibold">Character</p>
            <div className="mb-4">
              <label className="block text-sm font-medium ">Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium ">Description</label>
              <textarea
                value={botPersonality}
                onChange={(e) => setBotPersonality(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter the description of bot."
              />
            </div>
          </div>
        )}
        {settingTabs === "User" && (
          <div className="bg-gray-100 dark:bg-neutral-600 p-2 rounded-lg mb-4">
            <p className="font-semibold">User</p>
            <div className="mb-4">
              <label className="block text-sm font-medium ">Name</label>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium ">Description</label>
              <textarea
                value={yourPersonality}
                onChange={(e) => setYourPersonality(e.target.value)}
                className="mt-1 p-2 border rounded w-full"
                placeholder="Enter your description."
              />
            </div>
          </div>
        )}
        {settingTabs === "Chat" && (
          <button
            onClick={() => clearChatHistory()}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full mb-4"
          >
            Clear History
          </button>
        )}
      </div>
    </div>
  );
}
