
import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { APP_TITLE, NAV_ITEMS } from './constants.tsx'; // Adjusted import path
import { DashboardPage } from './pages/DashboardPage.tsx';
import { LiteraturePage } from './pages/LiteraturePage.tsx';
import { WritingPage } from './pages/WritingPage.tsx';
import { OrganizationPage } from './pages/OrganizationPage.tsx';
import { FormattingPage } from './pages/FormattingPage.tsx';
import { Article, Reference, Task, CitationStyle, CitationStyleType, ProjectGoal } from './types.ts';
import { useLocalStorage } from './hooks/useLocalStorage.ts';

const App: React.FC = () => {
  const location = useLocation();
  const [articles, setArticles] = useLocalStorage<Article[]>('articles', []);
  const [references, setReferences] = useLocalStorage<Reference[]>('references', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [goals, setGoals] = useLocalStorage<ProjectGoal[]>('goals', []);
  const [citationStyle, setCitationStyle] = useLocalStorage<CitationStyleType>('citationStyle', CitationStyle.APA);
  
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-100 text-red-700">
        <div className="p-6 bg-white shadow-lg rounded-md">
          <h1 className="text-2xl font-bold mb-4">Erro de Configuração</h1>
          <p>A chave da API Gemini (API_KEY) não foi configurada no ambiente.</p>
          <p>Por favor, configure a variável de ambiente `process.env.API_KEY` para usar o aplicativo.</p>
        </div>
      </div>
    );
  }
  
  const TitleIcon = NAV_ITEMS[0].icon;

  return (
    <div className="flex h-screen bg-slate-200">
      <aside className="w-64 bg-slate-800 text-slate-100 p-4 space-y-4 fixed h-full overflow-y-auto">
        <h1 className="text-2xl font-semibold text-sky-400 flex items-center">
           <TitleIcon className="w-8 h-8 mr-2" />
           {APP_TITLE.split(' IA')[0]}<span className="text-sky-500"> IA</span>
        </h1>
        <nav>
          <ul>
            {NAV_ITEMS.map(item => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-2 rounded-md hover:bg-slate-700 transition-colors ${
                    location.pathname === item.path ? 'bg-sky-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardPage articles={articles} tasks={tasks} goals={goals} />} />
          <Route path="/literature" element={<LiteraturePage articles={articles} setArticles={setArticles} references={references} setReferences={setReferences} citationStyle={citationStyle} setCitationStyle={setCitationStyle} />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/organization" element={<OrganizationPage tasks={tasks} setTasks={setTasks} goals={goals} setGoals={setGoals} />} />
          <Route path="/formatting" element={<FormattingPage references={references} citationStyle={citationStyle} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
