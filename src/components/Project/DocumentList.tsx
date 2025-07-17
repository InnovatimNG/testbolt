import React, { useState } from 'react';
import { Document } from '../../context/ProjectContext';
import { 
  FileText, 
  Mail, 
  File, 
  Search, 
  Filter,
  Download,
  Eye,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'processing' | 'error'>('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'email':
        return Mail;
      case 'pdf':
      case 'document':
        return FileText;
      default:
        return File;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'processing':
        return Clock;
      case 'error':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'processing':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document</h3>
        <p className="text-gray-600">
          Uploadez vos premiers documents pour commencer l'analyse.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="completed">Terminés</option>
            <option value="processing">En traitement</option>
            <option value="error">Erreurs</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocuments.map((document) => {
          const Icon = getFileIcon(document.type);
          const StatusIcon = getStatusIcon(document.status);
          
          return (
            <div
              key={document.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <Icon className="w-8 h-8 text-gray-500 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {document.name}
                      </h4>
                      <StatusIcon className={`w-4 h-4 ${getStatusColor(document.status)}`} />
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{formatFileSize(document.size)}</span>
                      <span>•</span>
                      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{document.keyPoints.length} points clés</span>
                    </div>
                    
                    {document.summary && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {document.summary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedDocument(document)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Voir les détails"
                  >
                    <Eye className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Télécharger"
                  >
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Key Points Preview */}
              {document.keyPoints.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {document.keyPoints.slice(0, 3).map((keyPoint) => {
                      const getKeyPointIcon = (type: string) => {
                        switch (type) {
                          case 'person':
                            return User;
                          case 'date':
                            return Calendar;
                          case 'location':
                            return MapPin;
                          default:
                            return CheckCircle;
                        }
                      };
                      
                      const KeyPointIcon = getKeyPointIcon(keyPoint.type);
                      
                      return (
                        <div
                          key={keyPoint.id}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                          <KeyPointIcon className="w-3 h-3 text-gray-500" />
                          <span className="text-gray-700 truncate max-w-32">
                            {keyPoint.content}
                          </span>
                        </div>
                      );
                    })}
                    {document.keyPoints.length > 3 && (
                      <span className="text-xs text-gray-500 px-2 py-1">
                        +{document.keyPoints.length - 3} autres
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Document Detail Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du document
              </h3>
              <button
                onClick={() => setSelectedDocument(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Informations générales</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Nom:</span>
                      <p className="font-medium">{selectedDocument.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Taille:</span>
                      <p className="font-medium">{formatFileSize(selectedDocument.size)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Type:</span>
                      <p className="font-medium">{selectedDocument.type}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date d'upload:</span>
                      <p className="font-medium">
                        {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedDocument.summary && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Résumé</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedDocument.summary}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Points clés ({selectedDocument.keyPoints.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedDocument.keyPoints.map((keyPoint) => {
                      const getKeyPointIcon = (type: string) => {
                        switch (type) {
                          case 'person':
                            return User;
                          case 'date':
                            return Calendar;
                          case 'location':
                            return MapPin;
                          default:
                            return CheckCircle;
                        }
                      };
                      
                      const KeyPointIcon = getKeyPointIcon(keyPoint.type);
                      
                      return (
                        <div
                          key={keyPoint.id}
                          className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <KeyPointIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {keyPoint.content}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                Confiance: {Math.round(keyPoint.confidence * 100)}%
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500 capitalize">
                                {keyPoint.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentList;