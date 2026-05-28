import { useEffect, useRef, useState } from "react";
import { chatMessage } from "./interfaces";

type EditMessageModalProps = {
  message: chatMessage;
  index: number;
  onSave: (index: number, newContent: string) => void;
  onClose: () => void;
};

export default function EditMessageModal({
  message,
  index,
  onSave,
  onClose,
}: EditMessageModalProps) {
  const [content, setContent] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }, []);

  function handleSave() {
    onSave(index, content);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
    if (e.key === "Escape") {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-60 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-200 rounded-lg w-full max-w-md flex flex-col gap-3 p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-base font-semibold">Edit message</h2>
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            ❌
          </button>
        </div>

        <textarea
          ref={textareaRef}
          className="w-full rounded-md border border-gray-300 dark:border-neutral-600 bg-gray-50 dark:bg-neutral-700 text-gray-800 dark:text-gray-100 text-sm p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <p className="text-xs text-gray-400 dark:text-neutral-500 -mt-1">
          Ctrl+Enter to save · Esc to cancel
        </p>

        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
