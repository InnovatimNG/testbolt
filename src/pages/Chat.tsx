import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Search,
  Sparkles,
  Clock,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  sources?: Array<{
    document: string;
    excerpt: string;
    confidence: number;
  }>;
}

const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProject();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const project = projects.find(p => p.id === id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (project && messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: `Bonjour ! Je suis votre assistant IA pour le projet "${project.name}". J'ai analysé ${project.documentsCount} documents et extrait ${project.keyPointsCount} points clés. Que souhaitez-vous savoir ?`,
        timestamp: new Date()
      }]);
    }
  }, [project]);

  const simulateResponse = async (userMessage: string): Promise<Message> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock responses based on keywords
    let response = "Je ne trouve pas d'information spécifique sur ce sujet dans les documents du projet.";
    let sources: Message['sources'] = undefined;

    if (userMessage.toLowerCase().includes('électrique') || userMessage.toLowerCase().includes('installation')) {
      response = "D'après l'analyse des documents, l'installation électrique a été validée par Mme Martin le 12 mars. Cette décision a été prise lors de la réunion de coordination avec l'équipe technique.";
      sources = [
        {
          document: "Email_Installation_Electrique.eml",
          excerpt: "Installation électrique validée par Mme Martin le 12 mars",
          confidence: 0.95
        }
      ];
    } else if (userMessage.toLowerCase().includes('qui') || userMessage.toLowerCase().includes('personne')) {
      response = "Voici les principales personnes mentionnées dans le projet :\n\n• **Mme Martin** - Chef de projet, responsable des validations techniques\n• **M. Dubois** - Architecte principal\n• **Équipe technique** - Mentionnée dans plusieurs échanges";
      sources = [
        {
          document: "Email_Installation_Electrique.eml",
          excerpt: "Mme Martin - Chef de projet",
          confidence: 0.98
        }
      ];
    } else if (userMessage.toLowerCase().includes('quand') || userMessage.toLowerCase().includes('date')) {
      response = "Voici les dates importantes identifiées :\n\n• **12 mars 2024** - Validation de l'installation électrique\n• **15 mars 2024** - Réunion de suivi prévue\n• **20 mars 2024** - Date limite pour les ajustements";
    } else if (userMessage.toLowerCase().includes('résumé') || userMessage.toLowerCase().includes('synthèse')) {
      response = `Voici un résumé du projet "${project?.name}" :\n\n**Documents analysés :** ${project?.documentsCount}\n**Points clés extraits :** ${project?.keyPointsCount}\n\n**Principales décisions :**\n• Installation électrique validée\n• Équipe technique constituée\n• Planning établi\n\n**Prochaines étapes :**\n• Finalisation des détails techniques\n• Coordination avec les fournisseurs`;
    }

    return {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      sources
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await simulateResponse(inputValue);
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Qui a validé l'installation électrique ?",
    "Quelles sont les prochaines étapes du projet ?",
    "Fais-moi un résumé des décisions importantes",
    "Quels documents mentionnent des dates limites ?"
  ];

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

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to={`/projects/${project.id}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  project.color === 'blue' ? 'bg-blue-500' :
                  project.color === 'green' ? 'bg-green-500' :
                  'bg-purple-500'
                }`}></div>
                <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              </div>
              <p className="text-sm text-gray-600">Chat IA - {project.documentsCount} documents analysés</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span>Powered by GPT-4o</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-3xl flex space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gradient-to-br from-purple-500 to-blue-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Sources */}
                {message.sources && (
                  <div className="mt-2 space-y-2 max-w-md">
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <Search className="w-3 h-3" />
                      <span>Sources utilisées :</span>
                    </p>
                    {message.sources.map((source, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <FileText className="w-3 h-3 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">{source.document}</span>
                          <span className="text-xs text-green-600">
                            {Math.round(source.confidence * 100)}% confiance
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 italic">"{source.excerpt}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl flex space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Questions suggérées :</p>
            <div className="space-y-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(question)}
                  className="block w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-white p-2 rounded border border-transparent hover:border-blue-200 transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur le projet..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;