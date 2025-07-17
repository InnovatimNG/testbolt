import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  FileText,
  BarChart3,
  Clock,
  Archive,
  Trash2,
  Edit
} from 'lucide-react';

const Projects: React.FC = () => {
  const { projects, deleteProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50 hover:border-blue-300';
      case 'green':
        return 'border-green-200 bg-green-50 hover:border-green-300';
      case 'purple':
        return 'border-purple-200 bg-purple-50 hover:border-purple-300';
      default:
        return 'border-gray-200 bg-gray-50 hover:border-gray-300';
    }
  };

  const getDotColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      case 'purple':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-1">Gérez et explorez vos projets d'analyse documentaire</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="archived">Archivés</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`relative bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group ${getColorClasses(project.color)}`}
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getDotColor(project.color)}`}></div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {project.name}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'active' ? 'Actif' : 'Archivé'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <button className="p-1 rounded-lg hover:bg-white hover:shadow-sm transition-all opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Project Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Project Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{project.documentsCount} documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{project.keyPointsCount} points clés</span>
              </div>
            </div>

            {/* Last Activity */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
              <Clock className="w-3 h-3" />
              <span>Dernière activité: {project.lastActivity}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Link
                to={`/projects/${project.id}`}
                className="flex-1 bg-white text-gray-700 border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
              >
                Voir détails
              </Link>
              <Link
                to={`/projects/${project.id}/chat`}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Chat IA
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun projet trouvé</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Aucun projet ne correspond à votre recherche.' : 'Créez votre premier projet pour commencer.'}
          </p>
          {!searchTerm && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Créer un projet</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;