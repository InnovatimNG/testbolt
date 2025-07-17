import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import { ProjectProvider } from './context/ProjectContext';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProjectProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
          
          <div className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-16'
          }`}>
            <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/projects/:id/chat" element={<Chat />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ProjectProvider>
  );
}

export default App;