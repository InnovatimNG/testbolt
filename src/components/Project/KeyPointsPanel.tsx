import React, { useState } from 'react';
import { Project } from '../../context/ProjectContext';
import { 
  Search, 
  Filter, 
  User, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  FileText, 
  Archive,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface KeyPointsPanelProps {
  project: Project;
}

const KeyPointsPanel: React.FC<KeyPointsPanelProps> = ({ project }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'date' | 'person' | 'location' | 'task' | 'decision' | 'document'>('all');

  // Collect all key points from all documents
  const allKeyPoints = project.documents.flatMap(doc => doc.keyPoints);

  const filteredKeyPoints = allKeyPoints.filter(keyPoint => {
    const matchesSearch = keyPoint.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || keyPoint.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getKeyPointIcon = (type: string) => {
    switch (type) {
      case 'person':
        return User;
      case 'date':
        return Calendar;
      case 'location':
        return MapPin;
      case 'task':
        return CheckCircle;
      case 'decision':
        return Archive;
      case 'document':
        return FileText;
      default:
        return CheckCircle;
    }
  };

  const getKeyPointColor = (type: string) => {
    switch (type) {
      case 'person':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'date':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'location':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'task':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'decision':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'document':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const keyPointStats = {
    total: allKeyPoints.length,
    byType: allKeyPoints.reduce((acc, kp) => {
      acc[kp.type] = (acc[kp.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(keyPointStats.byType).map(([type, count]) => {
          const Icon = getKeyPointIcon(type);
          return (
            <div key={type} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <Icon className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-lg font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-600 capitalize">{type}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher dans les points clés..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="all">Tous les types</option>
            <option value="person">Personnes</option>
            <option value="date">Dates</option>
            <option value="location">Lieux</option>
            <option value="task">Tâches</option>
            <option value="decision">Décisions</option>
            <option value="document">Documents</option>
          </select>
        </div>
      </div>

      {/* Key Points List */}
      {filteredKeyPoints.length === 0 ? (
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun point clé trouvé</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Aucun point clé ne correspond à votre recherche.' : 'Les points clés apparaîtront ici une fois les documents traités.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredKeyPoints.map((keyPoint) => {
            const Icon = getKeyPointIcon(keyPoint.type);
            
            return (
              <div
                key={keyPoint.id}
                className={`p-4 rounded-lg border ${getKeyPointColor(keyPoint.type)}`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">
                      {keyPoint.content}
                    </p>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>{keyPoint.source}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>Confiance: {Math.round(keyPoint.confidence * 100)}%</span>
                      </span>
                      <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full capitalize">
                        {keyPoint.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KeyPointsPanel;