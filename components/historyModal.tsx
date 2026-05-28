import { chatMessage } from "./interfaces";
import { useEffect, useRef, useState } from "react";
import EditMessageModal from "./EditMessageModal";

type HistoryModalProps = {
  chatHistory: chatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<chatMessage[]>>;
  characterName: string;
  userName: string;
  setHistoryModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function HistoryModal({
  chatHistory,
  setChatHistory,
  characterName,
  userName,
  setHistoryModal,
}: HistoryModalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [editTarget, setEditTarget] = useState<{
    message: chatMessage;
    index: number;
  } | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  function clearChatHistory() {
    confirm("Are you sure you want to clear the chat history?") &&
      setChatHistory([]);
  }

  function handleSaveEdit(index: number, newContent: string) {
    setChatHistory((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], content: newContent };
      return updated;
    });
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={() => setHistoryModal(false)}
      >
        <div
          className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 rounded-lg w-full max-w-md flex flex-col"
          style={{ maxHeight: "85vh" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center text-lg font-semibold px-4 py-3 border-b border-gray-200 dark:border-neutral-700 shrink-0">
            <span>Chat History</span>
            <button onClick={() => setHistoryModal(false)}>❌</button>
          </div>

          <div
            className="overflow-y-auto flex-1 px-4 py-3
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:rounded-full
              [&::-webkit-scrollbar-track]:bg-stone-100
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-stone-300
              dark:[&::-webkit-scrollbar-track]:bg-neutral-700
              dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
          >
            {chatHistory.length === 0 && (
              <p className="text-center">No chat history yet.</p>
            )}
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className="mb-4 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-sm overflow-hidden"
              >
                <div className="px-4 py-2 bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {message.role === "user" ? userName : characterName}
                    <span className="text-xs text-gray-400/50">
                      {" "}
                      ({message.role})
                    </span>
                  </span>
                  <div>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(message.content)
                      }
                    >
                      📋
                    </button>
                    <button onClick={() => setEditTarget({ message, index })}>
                      ✏️
                    </button>
                  </div>
                </div>
                <div className="p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-100">
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex justify-center px-4 py-3 border-t border-gray-200 dark:border-neutral-700 shrink-0">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-full rounded"
              onClick={clearChatHistory}
            >
              Clear Chat History
            </button>
          </div>
        </div>
      </div>

      {editTarget && (
        <EditMessageModal
          message={editTarget.message}
          index={editTarget.index}
          onSave={handleSaveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  );
}
