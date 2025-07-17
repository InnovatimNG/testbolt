import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface KeyPoint {
  id: string;
  type: 'date' | 'person' | 'location' | 'task' | 'decision' | 'document';
  content: string;
  source: string;
  confidence: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  keyPoints: KeyPoint[];
  summary?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  documentsCount: number;
  keyPointsCount: number;
  lastActivity: string;
  status: 'active' | 'archived';
  color: string;
  documents: Document[];
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addDocument: (projectId: string, document: Omit<Document, 'id'>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Maison Lausanne',
    description: 'Construction d\'une villa moderne à Lausanne',
    createdAt: '2024-01-15',
    documentsCount: 45,
    keyPointsCount: 234,
    lastActivity: '2024-01-20',
    status: 'active',
    color: 'blue',
    documents: [
      {
        id: '1',
        name: 'Email_Installation_Electrique.eml',
        type: 'email',
        size: 15420,
        uploadDate: '2024-01-20',
        status: 'completed',
        summary: 'Discussion sur l\'installation électrique avec validation par Mme Martin',
        keyPoints: [
          {
            id: '1',
            type: 'decision',
            content: 'Installation électrique validée par Mme Martin le 12 mars',
            source: 'Email_Installation_Electrique.eml',
            confidence: 0.95
          },
          {
            id: '2',
            type: 'person',
            content: 'Mme Martin - Chef de projet',
            source: 'Email_Installation_Electrique.eml',
            confidence: 0.98
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Rénovation Bureau Genève',
    description: 'Rénovation complète des bureaux du centre-ville',
    createdAt: '2024-01-10',
    documentsCount: 28,
    keyPointsCount: 156,
    lastActivity: '2024-01-18',
    status: 'active',
    color: 'green',
    documents: []
  },
  {
    id: '3',
    name: 'Complexe Résidentiel Montreux',
    description: 'Projet de construction d\'un complexe de 50 logements',
    createdAt: '2023-12-01',
    documentsCount: 67,
    keyPointsCount: 389,
    lastActivity: '2024-01-16',
    status: 'archived',
    color: 'purple',
    documents: []
  }
];

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects([...projects, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const addDocument = (projectId: string, documentData: Omit<Document, 'id'>) => {
    const newDocument: Document = {
      ...documentData,
      id: Date.now().toString(),
    };
    
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { 
            ...project, 
            documents: [...project.documents, newDocument],
            documentsCount: project.documentsCount + 1
          }
        : project
    ));
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      currentProject,
      setCurrentProject,
      addProject,
      updateProject,
      deleteProject,
      addDocument,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};