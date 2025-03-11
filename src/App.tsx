import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ModelViewer } from './components/ModelViewer';
import { Cuboid as Cube3D } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center">
          <Cube3D className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">CAD Viewer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {!selectedFile && (
            <div className="flex justify-center">
              <FileUpload onFileSelect={setSelectedFile} />
            </div>
          )}

          {selectedFile && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Viewing: {selectedFile.name}
                </h2>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Upload New Model
                </button>
              </div>
              <ModelViewer file={selectedFile} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;