import {chatMessage} from './interfaces';

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
  setChatHistory
}: SettingModalProps) {
    function clearChatHistory() {
      setChatHistory([]);
    }
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
        <div className="bg-gray-100 dark:bg-neutral-600 p-2 rounded-lg mb-4">
          <p className="font-semibold">API</p>
          <div className="mb-4">
            <label className="block text-sm font-medium ">API Endpoint</label>
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
            <label className="block text-sm font-medium ">System Prompt</label>
            <textarea
              value={apiPrompt}
              onChange={(e) => setApiPrompt(e.target.value)}
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter the System prompt."
            />
          </div>
        </div>
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
        <button onClick={() => clearChatHistory()} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded w-full mb-4">Clear History</button>
      </div>
    </div>
  );
}
