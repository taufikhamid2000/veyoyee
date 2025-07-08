import { useRef } from "react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadFile: File | null;
  onFileChange: (file: File | null) => void;
  uploadType: string;
  onTypeChange: (type: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  uploadFile,
  onFileChange,
  uploadType,
  onTypeChange,
  onSubmit,
}: UploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200">
          Upload Survey Data
        </h2>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 font-medium">File Type</label>
          <select
            value={uploadType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm w-full"
          >
            <option value="csv">CSV (Comma Separated Values)</option>
            <option value="pdf">PDF (Portable Document Format)</option>
          </select>
          <label className="block mb-2 font-medium">Select File</label>
          <input
            ref={fileInputRef}
            type="file"
            accept={uploadType === "csv" ? ".csv" : ".pdf"}
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="mb-4 block w-full text-sm text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploadFile && (
            <div className="mb-4 text-xs text-gray-600 dark:text-gray-300">
              Selected: {uploadFile.name}
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            disabled={!uploadFile}
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
