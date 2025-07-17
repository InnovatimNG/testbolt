import React from 'react';
import { Link } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Clock,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Calendar
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { projects } = useProject();

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalDocuments: projects.reduce((sum, p) => sum + p.documentsCount, 0),
    totalKeyPoints: projects.reduce((sum, p) => sum + p.keyPointsCount, 0),
  };

  const recentActivity = [
    {
      id: '1',
      type: 'document',
      message: 'Nouveau document uploadé dans "Maison Lausanne"',
      time: '2024-01-20 14:30',
      project: 'Maison Lausanne'
    },
    {
      id: '2',
      type: 'keypoint',
      message: '15 nouveaux points clés extraits',
      time: '2024-01-20 14:25',
      project: 'Maison Lausanne'
    },
    {
      id: '3',
      type: 'chat',
      message: 'Question posée dans le chat du projet',
      time: '2024-01-20 11:15',
      project: 'Rénovation Bureau Genève'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Vue d'ensemble de vos projets et activités</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/projects"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Voir tous les projets</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projets Totaux</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600 font-medium">{stats.activeProjects} actifs</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDocuments}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600 font-medium">+12 cette semaine</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points Clés</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalKeyPoints}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-purple-600 font-medium">Extraits automatiquement</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">47</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-orange-600 font-medium">8 aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Projets Récents</h2>
              <Link 
                to="/projects" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>Voir tout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      project.color === 'blue' ? 'bg-blue-500' :
                      project.color === 'green' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}></div>
                    <div>
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-700">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600">{project.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{project.documentsCount} docs</p>
                    <p className="text-xs text-gray-500">{project.keyPointsCount} points clés</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
          </div>
          <div className="p-6 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'document' ? 'bg-blue-100' :
                  activity.type === 'keypoint' ? 'bg-purple-100' :
                  'bg-green-100'
                }`}>
                  {activity.type === 'document' && <FileText className="w-4 h-4 text-blue-600" />}
                  {activity.type === 'keypoint' && <BarChart3 className="w-4 h-4 text-purple-600" />}
                  {activity.type === 'chat' && <MessageSquare className="w-4 h-4 text-green-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.project}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Prêt à analyser vos documents ?</h2>
            <p className="text-blue-100 mt-1">
              Uploadez vos documents et laissez l'IA extraire les informations importantes
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/projects"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <FolderOpen className="w-5 h-5" />
              <span>Créer un projet</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;