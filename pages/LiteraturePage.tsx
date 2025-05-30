
import React, { useState, useCallback } from 'react';
import { Article, Reference, CitationStyle, CitationStyleType } from '../types.ts';
import { Button } from '../components/common/Button.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { Input } from '../components/common/Input.tsx';
import { Textarea } from '../components/common/Textarea.tsx';
import { Select } from '../components/common/Select.tsx';
import { Card } from '../components/common/Card.tsx';
import { generateText } from '../services/geminiService.ts';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { PlusCircleIcon, TrashIcon, BookOpenIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface LiteraturePageProps {
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  references: Reference[];
  setReferences: React.Dispatch<React.SetStateAction<Reference[]>>;
  citationStyle: CitationStyleType;
  setCitationStyle: React.Dispatch<React.SetStateAction<CitationStyleType>>;
}

const ArticleForm: React.FC<{ onSubmit: (article: Omit<Article, 'id' | 'summary'>) => void; initialData?: Partial<Article>; onClose: () => void; }> = ({ onSubmit, initialData, onClose }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [authors, setAuthors] = useState(initialData?.authors || '');
  const [abstract, setAbstract] = useState(initialData?.abstract || '');
  const [url, setUrl] = useState(initialData?.url || '');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, authors, abstract, url, notes });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Título" value={title} onChange={e => setTitle(e.target.value)} required />
      <Input label="Autores" value={authors} onChange={e => setAuthors(e.target.value)} required />
      <Textarea label="Resumo/Abstract" value={abstract} onChange={e => setAbstract(e.target.value)} rows={5} />
      <Input label="URL (Opcional)" type="url" value={url} onChange={e => setUrl(e.target.value)} />
      <Textarea label="Anotações Pessoais" value={notes} onChange={e => setNotes(e.target.value)} rows={3} />
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Salvar Artigo</Button>
      </div>
    </form>
  );
};


export const LiteraturePage: React.FC<LiteraturePageProps> = ({ articles, setArticles, references, setReferences, citationStyle, setCitationStyle }) => {
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | undefined>(undefined);
  const [selectedArticleForSummary, setSelectedArticleForSummary] = useState<Article | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const handleAddArticle = (articleData: Omit<Article, 'id' | 'summary'>) => {
    const newArticle: Article = { ...articleData, id: Date.now().toString() };
    setArticles(prev => [...prev, newArticle]);
  };

  const handleEditArticle = (articleData: Omit<Article, 'id' | 'summary'>) => {
    if (editingArticle) {
      setArticles(prev => prev.map(a => a.id === editingArticle.id ? { ...editingArticle, ...articleData } : a));
    }
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setIsArticleModalOpen(true);
  };
  
  const openAddModal = () => {
    setEditingArticle(undefined);
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm("Tem certeza que deseja excluir este artigo?")) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
    }
  };

  const handleSummarize = useCallback(async (article: Article) => {
    if (!article.abstract && !article.notes) { // Or some other content field
      setSummaryError("O artigo não possui texto suficiente (resumo ou anotações) para gerar um sumário.");
      return;
    }
    setSelectedArticleForSummary(article);
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const textToSummarize = article.abstract || article.notes || article.title; // Prioritize abstract, then notes, then title
      const prompt = `Resuma o seguinte texto acadêmico em 3-5 frases concisas, destacando os pontos principais:\n\n${textToSummarize}`;
      const summary = await generateText(prompt, "Você é um assistente de pesquisa que cria resumos claros e informativos.");
      setArticles(prevArticles => prevArticles.map(a => a.id === article.id ? { ...a, summary } : a));
      setSelectedArticleForSummary(prev => prev ? {...prev, summary} : null); // Update selected article too
    } catch (error) {
      console.error("Failed to summarize article:", error);
      setSummaryError("Falha ao gerar o resumo. Tente novamente.");
    } finally {
      setSummaryLoading(false);
    }
  }, [setArticles]);


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Gerenciador de Literatura</h1>
        <Button onClick={openAddModal} leftIcon={<PlusCircleIcon className="w-5 h-5"/>}>
          Adicionar Artigo
        </Button>
      </div>

      {isArticleModalOpen && (
        <Modal
          isOpen={isArticleModalOpen}
          onClose={() => setIsArticleModalOpen(false)}
          title={editingArticle ? "Editar Artigo" : "Adicionar Novo Artigo"}
          size="lg"
        >
          <ArticleForm 
            onSubmit={editingArticle ? handleEditArticle : handleAddArticle} 
            initialData={editingArticle}
            onClose={() => setIsArticleModalOpen(false)}
          />
        </Modal>
      )}
      
      {selectedArticleForSummary && (
        <Modal
            isOpen={!!selectedArticleForSummary}
            onClose={() => setSelectedArticleForSummary(null)}
            title={`Resumo: ${selectedArticleForSummary.title}`}
            size="lg"
        >
            {summaryLoading && <LoadingSpinner text="Gerando resumo..." />}
            {summaryError && <p className="text-red-500 bg-red-100 p-3 rounded-md">{summaryError}</p>}
            {selectedArticleForSummary.summary && !summaryLoading && !summaryError && (
                <div className="space-y-3">
                    <p className="text-slate-700 whitespace-pre-wrap">{selectedArticleForSummary.summary}</p>
                </div>
            )}
             <div className="mt-4 text-right">
                <Button variant="secondary" onClick={() => setSelectedArticleForSummary(null)}>Fechar</Button>
            </div>
        </Modal>
      )}


      <Card title="Seus Artigos" bodyClassName="p-0">
        {articles.length === 0 ? (
          <p className="p-4 text-slate-500">Nenhum artigo adicionado ainda. Clique em "Adicionar Artigo" para começar.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {articles.map(article => (
              <li key={article.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-sky-700">{article.title}</h3>
                    <p className="text-sm text-slate-600">{article.authors}</p>
                    {article.abstract && <p className="mt-1 text-sm text-slate-500 truncate max-w-xl">{article.abstract}</p>}
                    {article.url && <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xs text-sky-500 hover:underline">Acessar URL</a>}
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-4">
                    <Button size="sm" variant="ghost" onClick={() => handleSummarize(article)} title="Gerar Resumo com IA" disabled={summaryLoading && selectedArticleForSummary?.id === article.id}>
                       <SparklesIcon className="w-5 h-5 text-yellow-500"/>
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => openEditModal(article)}>Editar</Button>
                    <Button size="sm" variant="danger" onClick={() => handleDeleteArticle(article.id)}><TrashIcon className="w-4 h-4"/></Button>
                  </div>
                </div>
                {article.notes && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="text-xs font-semibold text-yellow-700">Anotações:</h4>
                    <p className="text-xs text-yellow-600 whitespace-pre-wrap">{article.notes}</p>
                  </div>
                )}
                {article.summary && (
                  <div className="mt-2 p-3 bg-sky-50 border border-sky-200 rounded">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-sky-700 flex items-center"><SparklesIcon className="w-4 h-4 mr-1 text-sky-600"/> Resumo IA:</h4>
                        <button onClick={() => setSelectedArticleForSummary(article)} className="text-xs text-sky-600 hover:underline">Ver Completo</button>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap truncate max-h-20 overflow-hidden">{article.summary}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Placeholder for Bibliography Management - to be expanded */}
      <Card title="Gerenciador de Bibliografia (Em Breve)">
        <p className="text-slate-500">Funcionalidades para adicionar referências e gerar bibliografias em formatos como ABNT e APA serão implementadas aqui.</p>
        <div className="mt-4">
          <Select
            label="Estilo de Citação Padrão"
            value={citationStyle}
            onChange={e => setCitationStyle(e.target.value as CitationStyleType)}
            options={[
              { value: CitationStyle.APA, label: "APA" },
              { value: CitationStyle.ABNT, label: "ABNT" },
            ]}
          />
        </div>
         {references.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-slate-700">Referências Adicionadas: {references.length}</h4>
            {/* List references here */}
          </div>
        )}
      </Card>
    </div>
  );
};
