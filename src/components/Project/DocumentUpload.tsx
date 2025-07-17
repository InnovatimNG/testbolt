import React, { useState, useCallback } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Upload, FileText, Mail, File, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  projectId: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ projectId }) => {
  const { addDocument } = useProject();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'eml':
      case 'msg':
        return Mail;
      case 'pdf':
      case 'docx':
      case 'doc':
        return FileText;
      default:
        return File;
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'eml':
      case 'msg':
        return 'email';
      case 'pdf':
        return 'pdf';
      case 'docx':
      case 'doc':
        return 'document';
      case 'txt':
      case 'md':
        return 'text';
      default:
        return 'unknown';
    }
  };

  const simulateProcessing = async (file: File) => {
    setProcessing(prev => ({ ...prev, [file.name]: true }));
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Simulate keypoints extraction
    const mockKeyPoints = [
      {
        id: Date.now().toString(),
        type: 'person' as const,
        content: `Personne mentionnée dans ${file.name}`,
        source: file.name,
        confidence: 0.85 + Math.random() * 0.15
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'date' as const,
        content: `Date importante: ${new Date().toLocaleDateString()}`,
        source: file.name,
        confidence: 0.90 + Math.random() * 0.10
      }
    ];

    addDocument(projectId, {
      name: file.name,
      type: getFileType(file.name),
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'completed',
      keyPoints: mockKeyPoints,
      summary: `Résumé automatique généré pour ${file.name}. Ce document contient des informations importantes sur le projet.`
    });

    setProcessing(prev => ({ ...prev, [file.name]: false }));
    setUploadQueue(prev => prev.filter(f => f.name !== file.name));
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      const validExtensions = ['eml', 'msg', 'pdf', 'docx', 'doc', 'txt', 'md'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      return extension && validExtensions.includes(extension);
    });

    setUploadQueue(prev => [...prev, ...validFiles]);
    
    // Start processing files
    validFiles.forEach(file => {
      simulateProcessing(file);
    });
  }, [projectId, addDocument]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = ''; // Reset input
  }, [handleFiles]);

  const removeFromQueue = (fileName: string) => {
    setUploadQueue(prev => prev.filter(f => f.name !== fileName));
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${
          isDragging ? 'text-blue-500' : 'text-gray-400'
        }`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Glissez-déposez vos documents ici
        </h3>
        <p className="text-gray-600 mb-4">
          ou cliquez pour sélectionner des fichiers
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Formats supportés: .eml, .msg, .pdf, .docx, .txt, .md
        </p>
        
        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload className="w-5 h-5 mr-2" />
          Sélectionner des fichiers
          <input
            type="file"
            multiple
            accept=".eml,.msg,.pdf,.docx,.doc,.txt,.md"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="font-medium text-gray-900 mb-4">Files en cours de traitement</h4>
          <div className="space-y-3">
            {uploadQueue.map((file) => {
              const Icon = getFileIcon(file.name);
              const isProcessing = processing[file.name];
              
              return (
                <div key={file.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs text-blue-600">Traitement...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Terminé</span>
                      </>
                    )}
                    
                    <button
                      onClick={() => removeFromQueue(file.name)}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;