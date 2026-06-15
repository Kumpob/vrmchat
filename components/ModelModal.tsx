type ModelDropdownProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;

  modelPosX: number;
  setModelPosX: React.Dispatch<React.SetStateAction<number>>;
  modelPosY: number;
  setModelPosY: React.Dispatch<React.SetStateAction<number>>;
  modelPosZ: number;
  setModelPosZ: React.Dispatch<React.SetStateAction<number>>;
  modelRotY: number;
  setModelRotY: React.Dispatch<React.SetStateAction<number>>;

  leftArmZ: number;
  setLeftArmZ: React.Dispatch<React.SetStateAction<number>>;
  rightArmZ: number;
  setRightArmZ: React.Dispatch<React.SetStateAction<number>>;
  leftThumbX: number;
  setLeftThumbX: React.Dispatch<React.SetStateAction<number>>;
  rightThumbX: number;
  setRightThumbX: React.Dispatch<React.SetStateAction<number>>;

  onResetModel: () => void;
  onResetPose: () => void;
};

export default function ModelDropdown({
  setOpen,
  modelPosX,
  setModelPosX,
  modelPosY,
  setModelPosY,
  modelPosZ,
  setModelPosZ,
  modelRotY,
  setModelRotY,
  leftArmZ,
  setLeftArmZ,
  rightArmZ,
  setRightArmZ,
  leftThumbX,
  setLeftThumbX,
  rightThumbX,
  setRightThumbX,
  onResetModel,
  onResetPose,
}: ModelDropdownProps) {
  return (
    <div
      className="absolute top-16 left-4 z-50 w-72 max-h-[75vh] overflow-y-auto rounded-lg bg-white/90 dark:bg-neutral-800/90 backdrop-blur text-gray-700 dark:text-neutral-200 shadow-lg p-3
[&::-webkit-scrollbar]:w-2
[&::-webkit-scrollbar-track]:rounded-full
[&::-webkit-scrollbar-track]:bg-stone-100
[&::-webkit-scrollbar-thumb]:rounded-full
[&::-webkit-scrollbar-thumb]:bg-stone-300
dark:[&::-webkit-scrollbar-track]:bg-neutral-700
dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
    >
      <p className="font-semibold text-sm mb-2">Position</p>
      <div className="mb-2">
        <label className="block text-xs font-medium">X (left/right)</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-3"
            max="3"
            step="0.05"
            value={modelPosX}
            onChange={(e) => setModelPosX(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={modelPosX}
            onChange={(e) => setModelPosX(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium">Y (up/down)</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-3"
            max="3"
            step="0.05"
            value={modelPosY}
            onChange={(e) => setModelPosY(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={modelPosY}
            onChange={(e) => setModelPosY(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-xs font-medium">Z (forward/back)</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-3"
            max="3"
            step="0.05"
            value={modelPosZ}
            onChange={(e) => setModelPosZ(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={modelPosZ}
            onChange={(e) => setModelPosZ(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>

      <p className="font-semibold text-sm mb-2">Rotation</p>
      <div className="mb-3">
        <label className="block text-xs font-medium">Y (spin)</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-3.14"
            max="3.14"
            step="0.05"
            value={modelRotY}
            onChange={(e) => setModelRotY(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={modelRotY}
            onChange={(e) => setModelRotY(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>

      <p className="font-semibold text-sm mb-2">Arms</p>
      <div className="mb-2">
        <label className="block text-xs font-medium">Left Upper Arm Z</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={leftArmZ}
            onChange={(e) => setLeftArmZ(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={leftArmZ}
            onChange={(e) => setLeftArmZ(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium">Right Upper Arm Z</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={rightArmZ}
            onChange={(e) => setRightArmZ(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={rightArmZ}
            onChange={(e) => setRightArmZ(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>

      <p className="font-semibold text-sm mb-2">Thumbs</p>
      <div className="mb-2">
        <label className="block text-xs font-medium">Left Thumb X</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={leftThumbX}
            onChange={(e) => setLeftThumbX(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={leftThumbX}
            onChange={(e) => setLeftThumbX(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium">Right Thumb X</label>
        <div className="flex items-center gap-1">
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={rightThumbX}
            onChange={(e) => setRightThumbX(parseFloat(e.target.value))}
            className="flex-1"
          />
          <input
            type="number"
            step="0.05"
            value={rightThumbX}
            onChange={(e) => setRightThumbX(parseFloat(e.target.value) || 0)}
            className="w-16 p-1 border rounded text-xs dark:bg-neutral-700"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onResetPose}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-1.5 px-3 rounded text-sm"
        >
          Reset Pose
        </button>
        <button
          onClick={onResetModel}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-3 rounded text-sm"
        >
          Reset Avatar
        </button>
      </div>
    </div>
  );
}
