import React, { useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

interface ModelViewerProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

const BACKEND_URL = 'http://localhost:5001';

interface ModelControlsProps {
  onReset: () => void;
  onWireframe: () => void;
  isWireframe: boolean;
  onColorChange: (color: string) => void;
  currentColor: string;
  onNewFile: () => void;
}

const ModelControls: React.FC<ModelControlsProps> = ({
  onReset,
  onWireframe,
  isWireframe,
  onColorChange,
  currentColor,
  onNewFile,
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 flex items-center space-x-4">
      <button
        onClick={onNewFile}
        className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors flex items-center space-x-2"
        title="Upload New Model"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span>New Model</span>
      </button>
      <div className="h-6 w-px bg-gray-200"></div>
      <button
        onClick={onReset}
        className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title="Reset View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
      <button
        onClick={onWireframe}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          isWireframe ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
        title="Toggle Wireframe"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      <div className="flex items-center space-x-2">
        <label className="text-sm text-gray-600">Color:</label>
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onColorChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};

const Model: React.FC<{
  modelUrl: string;
  fileType: string;
  wireframe: boolean;
  color: string;
}> = ({ modelUrl, fileType, wireframe, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  React.useEffect(() => {
    if (fileType === 'stl') {
      const loader = new STLLoader();
      loader.load(modelUrl, (geometry: THREE.BufferGeometry) => {
        if (meshRef.current) {
          meshRef.current.geometry = geometry;
          geometry.computeVertexNormals();
          geometry.center();
          
          const box = new THREE.Box3().setFromObject(meshRef.current);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(maxDim * 2, maxDim * 2, maxDim * 2);
          camera.lookAt(0, 0, 0);
        }
      });
    } else if (fileType === 'obj') {
      const loader = new OBJLoader();
      loader.load(modelUrl, (object: THREE.Group) => {
        if (meshRef.current) {
          const mesh = object.children[0] as THREE.Mesh;
          meshRef.current.geometry = mesh.geometry;
          mesh.geometry.center();
          
          const box = new THREE.Box3().setFromObject(mesh);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          camera.position.set(maxDim * 2, maxDim * 2, maxDim * 2);
          camera.lookAt(0, 0, 0);
        }
      });
    }
  }, [modelUrl, fileType, camera]);

  return (
    <mesh ref={meshRef}>
      <meshStandardMaterial
        color={color}
        roughness={0.5}
        metalness={0.5}
        wireframe={wireframe}
      />
    </mesh>
  );
};

const Navbar: React.FC<{ fileName: string | null }> = ({ fileName }) => (
  <nav className="bg-white shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="ml-2 text-xl font-semibold text-gray-900">3D Model Viewer</span>
          {fileName && (
            <>
              <div className="mx-4 h-6 w-px bg-gray-200"></div>
              <span className="text-sm text-gray-500">{fileName}</span>
            </>
          )}
        </div>
      </div>
    </div>
  </nav>
);

const FileUpload: React.FC<{ onFileSelect: (file: File | null) => void }> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.name.toLowerCase().endsWith('.stl') || file.name.toLowerCase().endsWith('.obj'))) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <svg
        className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
      <p className="mb-2 text-lg font-semibold text-gray-700">
        Drag and drop your 3D model here
      </p>
      <p className="mb-4 text-sm text-gray-500">
        or click to select a file
      </p>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Select File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl,.obj"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onFileSelect(file);
        }}
      />
      <p className="mt-2 text-xs text-gray-500">
        Supported formats: .STL, .OBJ
      </p>
    </div>
  );
};

export const ModelViewer: React.FC<ModelViewerProps> = ({ file, onFileSelect }) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [modelColor, setModelColor] = useState('#888888');
  const controlsRef = useRef<any>(null);

  React.useEffect(() => {
    if (file) {
      const uploadFile = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch(`${BACKEND_URL}/upload`, {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const data = await response.json();
          setModelUrl(`${BACKEND_URL}/models/${data.filename}`);
        } catch (err) {
          setError('Failed to upload file. Please try again.');
          console.error('Upload error:', err);
        } finally {
          setIsLoading(false);
        }
      };

      uploadFile();
    } else {
      setModelUrl(null);
    }
  }, [file]);

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleNewFile = () => {
    setModelUrl(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar fileName={file?.name || null} />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {!modelUrl && !isLoading && (
            <div className="mb-8">
              <FileUpload onFileSelect={onFileSelect} />
            </div>
          )}
          
          {isLoading && (
            <div className="w-full h-[700px] bg-white rounded-xl shadow-sm flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading model...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {modelUrl && !isLoading && (
            <div className="relative w-full h-[700px] bg-white rounded-xl overflow-hidden shadow-sm">
              <Canvas
                camera={{ position: [10, 10, 10], fov: 50 }}
                shadows
              >
                <Stage environment="city" intensity={0.5}>
                  <Model
                    modelUrl={modelUrl}
                    fileType={file?.name.split('.').pop()?.toLowerCase() || ''}
                    wireframe={isWireframe}
                    color={modelColor}
                  />
                </Stage>
                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={false}
                />
              </Canvas>
              <ModelControls
                onReset={handleReset}
                onWireframe={() => setIsWireframe(!isWireframe)}
                isWireframe={isWireframe}
                onColorChange={setModelColor}
                currentColor={modelColor}
                onNewFile={handleNewFile}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};