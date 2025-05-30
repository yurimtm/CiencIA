
import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Task, ProjectGoal } from '../types.ts';
import { Card } from '../components/common/Card.tsx';
import { BookOpenIcon, ListBulletIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DashboardPageProps {
  articles: Article[];
  tasks: Task[];
  goals: ProjectGoal[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ articles, tasks, goals }) => {
  const recentArticles = articles.slice(0, 3);
  const upcomingTasks = tasks.filter(task => !task.isCompleted).slice(0, 3);
  const activeGoals = goals.filter(goal => !goal.isAchieved).slice(0, 3);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Visão Geral Rápida" className="bg-sky-50">
          <div className="space-y-3">
            <p className="text-slate-700">Artigos Gerenciados: <span className="font-semibold text-sky-700">{articles.length}</span></p>
            <p className="text-slate-700">Tarefas Pendentes: <span className="font-semibold text-sky-700">{tasks.filter(t => !t.isCompleted).length}</span></p>
            <p className="text-slate-700">Metas Ativas: <span className="font-semibold text-sky-700">{goals.filter(g => !g.isAchieved).length}</span></p>
          </div>
        </Card>

        <Card title="Artigos Recentes" className="bg-green-50">
          {recentArticles.length > 0 ? (
            <ul className="space-y-2">
              {recentArticles.map(article => (
                <li key={article.id} className="text-sm text-slate-600 truncate hover:text-green-700">
                  <Link to="/literature" className="flex items-center">
                    <BookOpenIcon className="w-4 h-4 mr-2 text-green-600 flex-shrink-0" />
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Nenhum artigo adicionado ainda.</p>
          )}
           <Link to="/literature" className="mt-3 inline-block text-sm text-green-600 hover:text-green-700 font-medium">
            Ver todos os artigos &rarr;
          </Link>
        </Card>

        <Card title="Próximas Tarefas" className="bg-yellow-50">
          {upcomingTasks.length > 0 ? (
            <ul className="space-y-2">
              {upcomingTasks.map(task => (
                <li key={task.id} className="text-sm text-slate-600 truncate hover:text-yellow-700">
                  <Link to="/organization" className="flex items-center">
                    <ListBulletIcon className="w-4 h-4 mr-2 text-yellow-600 flex-shrink-0" />
                    {task.description}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">Nenhuma tarefa pendente.</p>
          )}
          <Link to="/organization" className="mt-3 inline-block text-sm text-yellow-600 hover:text-yellow-700 font-medium">
            Ver todas as tarefas &rarr;
          </Link>
        </Card>
      </div>

      <Card title="Metas Atuais">
        {activeGoals.length > 0 ? (
           <ul className="space-y-2">
           {activeGoals.map(goal => (
             <li key={goal.id} className="text-slate-700 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-sky-600 flex-shrink-0"/>
                {goal.description}
             </li>
           ))}
         </ul>
        ) : (
          <p className="text-slate-500">Nenhuma meta definida. <Link to="/organization" className="text-sky-600 hover:underline">Defina suas metas aqui.</Link></p>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Acesso Rápido">
            <div className="flex flex-wrap gap-2">
                <Link to="/literature" className="bg-sky-500 hover:bg-sky-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Gerenciar Literatura
                </Link>
                <Link to="/writing" className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Assistente de Escrita
                </Link>
                <Link to="/organization" className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Organizar Tarefas
                </Link>
            </div>
        </Card>
        <Card title="Dica do Dia" className="bg-indigo-50">
            <p className="text-indigo-700">Lembre-se de fazer pausas regulares durante a pesquisa para manter o foco e a produtividade!</p>
        </Card>
      </div>

    </div>
  );
};