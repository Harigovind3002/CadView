import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && (file.name.endsWith('.stl') || file.name.endsWith('.obj'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && (file.name.endsWith('.stl') || file.name.endsWith('.obj'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
    >
      <input
        type="file"
        accept=".stl,.obj"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-lg font-medium text-gray-700">
          Drop your 3D model here or click to upload
        </p>
        <p className="mt-2 text-sm text-gray-500">Supports STL and OBJ files</p>
      </label>
    </div>
  );
};