
import React, { useState } from 'react';
import { Task, ProjectGoal } from '../types.ts';
import { Button } from '../components/common/Button.tsx';
import { Input } from '../components/common/Input.tsx';
import { Card } from '../components/common/Card.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { PlusCircleIcon, TrashIcon, CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { XCircleIcon } from '@heroicons/react/24/solid';


interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  initialData?: Partial<Task>;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description, dueDate });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Descrição da Tarefa" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        required 
        placeholder="Ex: Escrever introdução do Artigo X"
      />
      <Input 
        label="Data de Entrega (Opcional)" 
        type="date" 
        value={dueDate} 
        onChange={e => setDueDate(e.target.value)} 
      />
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{initialData?.id ? 'Salvar Alterações' : 'Adicionar Tarefa'}</Button>
      </div>
    </form>
  );
};


interface GoalFormProps {
  onSubmit: (goal: Omit<ProjectGoal, 'id' | 'isAchieved'>) => void;
  initialData?: Partial<ProjectGoal>;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, initialData, onClose }) => {
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({ description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input 
        label="Descrição da Meta" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        required 
        placeholder="Ex: Publicar artigo em revista Q1"
      />
       <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit">{initialData?.id ? 'Salvar Alterações' : 'Adicionar Meta'}</Button>
      </div>
    </form>
  );
};


interface OrganizationPageProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  goals: ProjectGoal[];
  setGoals: React.Dispatch<React.SetStateAction<ProjectGoal[]>>;
}

export const OrganizationPage: React.FC<OrganizationPageProps> = ({ tasks, setTasks, goals, setGoals }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ProjectGoal | undefined>(undefined);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = { ...taskData, id: Date.now().toString(), isCompleted: false };
    setTasks(prev => [...prev, newTask].sort((a,b) => (a.dueDate && b.dueDate) ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : 0));
    setIsTaskModalOpen(false);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t)
      .sort((a,b) => (a.dueDate && b.dueDate) ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime() : 0));
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };
  
  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openAddTaskModal = () => {
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
  };

  const handleAddGoal = (goalData: Omit<ProjectGoal, 'id' | 'isAchieved'>) => {
    const newGoal: ProjectGoal = { ...goalData, id: Date.now().toString(), isAchieved: false };
    setGoals(prev => [...prev, newGoal]);
    setIsGoalModalOpen(false);
  };

  const handleEditGoal = (goalData: Omit<ProjectGoal, 'id' | 'isAchieved'>) => {
     if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? { ...editingGoal, ...goalData } : g));
    }
    setIsGoalModalOpen(false);
    setEditingGoal(undefined);
  };

  const openEditGoalModal = (goal: ProjectGoal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const openAddGoalModal = () => {
    setEditingGoal(undefined);
    setIsGoalModalOpen(true);
  };

  const toggleGoalAchieved = (goalId: string) => {
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, isAchieved: !g.isAchieved } : g));
  };

  const handleDeleteGoal = (goalId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta meta?")) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
  };
  
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Organização e Planejamento</h1>

      {isTaskModalOpen && (
        <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={editingTask ? "Editar Tarefa" : "Adicionar Nova Tarefa"}>
          <TaskForm onSubmit={editingTask ? handleEditTask : handleAddTask} initialData={editingTask} onClose={() => setIsTaskModalOpen(false)} />
        </Modal>
      )}

      {isGoalModalOpen && (
        <Modal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} title={editingGoal ? "Editar Meta" : "Adicionar Nova Meta"}>
          <GoalForm onSubmit={editingGoal ? handleEditGoal : handleAddGoal} initialData={editingGoal} onClose={() => setIsGoalModalOpen(false)} />
        </Modal>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Lista de Tarefas" actions={<Button onClick={openAddTaskModal} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>Nova Tarefa</Button>}>
          {pendingTasks.length === 0 && completedTasks.length === 0 && <p className="text-slate-500">Nenhuma tarefa adicionada ainda.</p>}
          {pendingTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-semibold text-slate-700 mb-2">Pendentes</h3>
              <ul className="space-y-2">
                {pendingTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 bg-white border rounded-md shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center">
                      <input type="checkbox" checked={task.isCompleted} onChange={() => toggleTaskCompletion(task.id)} className="h-5 w-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mr-3" />
                      <div>
                        <span className={`${task.isCompleted ? 'line-through text-slate-500' : 'text-slate-800'}`}>{task.description}</span>
                        {task.dueDate && <p className={`text-xs ${new Date(task.dueDate) < new Date() && !task.isCompleted ? 'text-red-500' : 'text-slate-500'}`}>Prazo: {new Date(task.dueDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="space-x-1">
                      <Button size="sm" variant="ghost" onClick={() => openEditTaskModal(task)} title="Editar Tarefa"><PencilIcon className="w-4 h-4 text-slate-500"/></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)} title="Excluir Tarefa"><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {completedTasks.length > 0 && (
             <div className="mt-4">
              <h3 className="text-md font-semibold text-slate-700 mb-2">Concluídas</h3>
              <ul className="space-y-2">
                {completedTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-3 bg-green-50 border rounded-md">
                     <div className="flex items-center">
                      <input type="checkbox" checked={task.isCompleted} onChange={() => toggleTaskCompletion(task.id)} className="h-5 w-5 text-sky-600 border-slate-300 rounded focus:ring-sky-500 mr-3" />
                      <div>
                        <span className="line-through text-slate-500">{task.description}</span>
                         {task.dueDate && <p className="text-xs text-slate-400">Prazo: {new Date(task.dueDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                    <div className="space-x-1">
                       <Button size="sm" variant="ghost" onClick={() => handleDeleteTask(task.id)} title="Excluir Tarefa"><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>

        <Card title="Metas do Projeto" actions={<Button onClick={openAddGoalModal} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>Nova Meta</Button>}>
          {goals.length === 0 && <p className="text-slate-500">Nenhuma meta definida ainda.</p>}
          <ul className="space-y-3">
            {goals.map(goal => (
              <li key={goal.id} className={`flex items-center justify-between p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow ${goal.isAchieved ? 'bg-green-50' : 'bg-white'}`}>
                <div className="flex items-center">
                   {goal.isAchieved ? 
                    <CheckCircleIcon onClick={() => toggleGoalAchieved(goal.id)} className="w-6 h-6 text-green-500 mr-3 cursor-pointer flex-shrink-0" /> :
                    <XCircleIcon onClick={() => toggleGoalAchieved(goal.id)} className="w-6 h-6 text-slate-400 hover:text-green-500 mr-3 cursor-pointer flex-shrink-0" />
                   }
                  <span className={`${goal.isAchieved ? 'line-through text-slate-500' : 'text-slate-800'}`}>{goal.description}</span>
                </div>
                 <div className="space-x-1">
                    {!goal.isAchieved && <Button size="sm" variant="ghost" onClick={() => openEditGoalModal(goal)} title="Editar Meta"><PencilIcon className="w-4 h-4 text-slate-500"/></Button>}
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)} title="Excluir Meta"><TrashIcon className="w-4 h-4 text-red-500"/></Button>
                  </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      
      <Card title="Cronograma / Linha do Tempo (Visualização Futura)">
        <p className="text-slate-500">Uma visualização de cronograma ou linha do tempo para as tarefas e metas será implementada aqui.</p>
        {/* Placeholder for timeline component */}
      </Card>

    </div>
  );
};