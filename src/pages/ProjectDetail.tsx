import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import DocumentUpload from '../components/Project/DocumentUpload';
import DocumentList from '../components/Project/DocumentList';
import KeyPointsPanel from '../components/Project/KeyPointsPanel';
import { 
  ArrowLeft, 
  MessageSquare, 
  Upload, 
  FileText, 
  BarChart3,
  Settings,
  Share,
  Download
} from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProject();
  const [activeTab, setActiveTab] = useState<'documents' | 'keypoints' | 'analytics'>('documents');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h2>
        <p className="text-gray-600 mb-6">Le projet que vous recherchez n'existe pas.</p>
        <Link
          to="/projects"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour aux projets</span>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'documents', label: 'Documents', icon: FileText, count: project.documentsCount },
    { id: 'keypoints', label: 'Points Clés', icon: BarChart3, count: project.keyPointsCount },
    { id: 'analytics', label: 'Analytiques', icon: BarChart3, count: null },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/projects"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                project.color === 'blue' ? 'bg-blue-500' :
                project.color === 'green' ? 'bg-green-500' :
                'bg-purple-500'
              }`}></div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            </div>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Share className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <Link
            to={`/projects/${project.id}/chat`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat IA</span>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-xl font-bold text-gray-900">{project.documentsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Points Clés</p>
              <p className="text-xl font-bold text-gray-900">{project.keyPointsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">En traitement</p>
              <p className="text-xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <DocumentUpload projectId={project.id} />
              <DocumentList documents={project.documents} />
            </div>
          )}
          
          {activeTab === 'keypoints' && (
            <KeyPointsPanel project={project} />
          )}
          
          {activeTab === 'analytics' && (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytiques</h3>
              <p className="text-gray-600">Les analytiques détaillées seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;