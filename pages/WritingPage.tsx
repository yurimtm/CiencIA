
import React, { useState, useCallback } from 'react';
import { Button } from '../components/common/Button.tsx';
import { Textarea } from '../components/common/Textarea.tsx';
import { Card } from '../components/common/Card.tsx';
import { generateText } from '../services/geminiService.ts';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { Select } from '../components/common/Select.tsx';
import { SparklesIcon, LightBulbIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface WritingPageProps {}

const TEMPLATE_TYPES = [
  { value: 'introduction_review', label: 'Introdução (Revisão Sistemática)' },
  { value: 'methodology_experimental', label: 'Metodologia (Estudo Experimental)' },
  { value: 'discussion_generic', label: 'Discussão (Genérico)' },
  { value: 'abstract_research', label: 'Resumo (Artigo de Pesquisa)' },
];

const PHRASE_CONTEXTS = [
  { value: 'connecting_ideas', label: 'Conectar Ideias' },
  { value: 'introducing_evidence', label: 'Apresentar Evidências' },
  { value: 'expressing_contrast', label: 'Expressar Contraste' },
  { value: 'concluding_paragraph', label: 'Concluir Parágrafo' },
];

export const WritingPage: React.FC<WritingPageProps> = () => {
  const [templateType, setTemplateType] = useState<string>(TEMPLATE_TYPES[0].value);
  const [generatedTemplate, setGeneratedTemplate] = useState<string>('');
  const [templateLoading, setTemplateLoading] = useState<boolean>(false);
  const [templateError, setTemplateError] = useState<string | null>(null);

  const [textForReview, setTextForReview] = useState<string>('');
  const [reviewedText, setReviewedText] = useState<string>('');
  const [reviewLoading, setReviewLoading] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const [phraseContext, setPhraseContext] = useState<string>(PHRASE_CONTEXTS[0].value);
  const [suggestedPhrases, setSuggestedPhrases] = useState<string>('');
  const [phraseLoading, setPhraseLoading] = useState<boolean>(false);
  const [phraseError, setPhraseError] = useState<string | null>(null);

  const handleGenerateTemplate = useCallback(async () => {
    setTemplateLoading(true);
    setTemplateError(null);
    setGeneratedTemplate('');
    try {
      const selectedLabel = TEMPLATE_TYPES.find(t => t.value === templateType)?.label || "um artigo científico";
      const prompt = `Gere uma estrutura de tópicos detalhada ou um modelo inicial para a seção "${selectedLabel}" de um artigo científico. Inclua sugestões de subseções e pontos chave a serem abordados.`;
      const result = await generateText(prompt, "Você é um assistente de escrita acadêmica que ajuda a estruturar artigos.");
      setGeneratedTemplate(result);
    } catch (error) {
      setTemplateError('Falha ao gerar o modelo. Tente novamente.');
      console.error("Template generation error:", error);
    } finally {
      setTemplateLoading(false);
    }
  }, [templateType]);

  const handleReviewText = useCallback(async () => {
    if (!textForReview.trim()) {
      setReviewError("Por favor, insira o texto para revisão.");
      return;
    }
    setReviewLoading(true);
    setReviewError(null);
    setReviewedText('');
    try {
      const prompt = `Revise o seguinte texto acadêmico para clareza, gramática, ortografia e estilo. Sugira melhorias para torná-lo mais formal e fluído. Retorne o texto revisado e, se possível, uma breve lista de sugestões:\n\n${textForReview}`;
      const result = await generateText(prompt, "Você é um editor acadêmico experiente.");
      setReviewedText(result);
    } catch (error) {
      setReviewError('Falha ao revisar o texto. Tente novamente.');
      console.error("Text review error:", error);
    } finally {
      setReviewLoading(false);
    }
  }, [textForReview]);

  const handleSuggestPhrases = useCallback(async () => {
    setPhraseLoading(true);
    setPhraseError(null);
    setSuggestedPhrases('');
    try {
      const selectedLabel = PHRASE_CONTEXTS.find(p => p.value === phraseContext)?.label || "escrita científica";
      const prompt = `Sugira uma lista de frases ou conectores úteis para ${selectedLabel.toLowerCase()} em um texto científico. Forneça exemplos práticos.`;
      const result = await generateText(prompt, "Você é um assistente de escrita que fornece sugestões de linguagem acadêmica.");
      setSuggestedPhrases(result);
    } catch (error) {
      setPhraseError('Falha ao sugerir frases. Tente novamente.');
      console.error("Phrase suggestion error:", error);
    } finally {
      setPhraseLoading(false);
    }
  }, [phraseContext]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Assistente de Escrita Científica</h1>

      <Card title="Gerador de Estruturas e Modelos" titleClassName="bg-sky-50">
        <div className="space-y-4">
          <Select
            label="Tipo de Modelo"
            options={TEMPLATE_TYPES}
            value={templateType}
            onChange={e => setTemplateType(e.target.value)}
          />
          <Button onClick={handleGenerateTemplate} isLoading={templateLoading} leftIcon={<SparklesIcon className="w-5 h-5"/>}>
            Gerar Modelo
          </Button>
          {templateError && <p className="text-red-500 bg-red-100 p-2 rounded-md">{templateError}</p>}
          {templateLoading && <LoadingSpinner text="Gerando modelo..." className="my-4" />}
          {generatedTemplate && !templateLoading && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <h4 className="font-semibold text-slate-700 mb-2">Modelo Gerado:</h4>
              <Textarea value={generatedTemplate} readOnly rows={10} className="bg-white text-sm" />
            </div>
          )}
        </div>
      </Card>

      <Card title="Revisão Gramatical e de Estilo" titleClassName="bg-green-50">
        <div className="space-y-4">
          <Textarea
            label="Texto para Revisão"
            value={textForReview}
            onChange={e => setTextForReview(e.target.value)}
            rows={6}
            placeholder="Cole aqui o trecho que deseja revisar..."
          />
          <Button onClick={handleReviewText} isLoading={reviewLoading} leftIcon={<DocumentMagnifyingGlassIcon className="w-5 h-5"/>}>
            Revisar Texto
          </Button>
          {reviewError && <p className="text-red-500 bg-red-100 p-2 rounded-md">{reviewError}</p>}
          {reviewLoading && <LoadingSpinner text="Revisando texto..." className="my-4" />}
          {reviewedText && !reviewLoading && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <h4 className="font-semibold text-slate-700 mb-2">Texto Revisado e Sugestões:</h4>
              <Textarea value={reviewedText} readOnly rows={10} className="bg-white text-sm" />
            </div>
          )}
        </div>
      </Card>
      
      <Card title="Sugestor de Frases e Conectores" titleClassName="bg-yellow-50">
        <div className="space-y-4">
          <Select
            label="Contexto da Frase"
            options={PHRASE_CONTEXTS}
            value={phraseContext}
            onChange={e => setPhraseContext(e.target.value)}
          />
          <Button onClick={handleSuggestPhrases} isLoading={phraseLoading} leftIcon={<LightBulbIcon className="w-5 h-5"/>}>
            Sugerir Frases
          </Button>
          {phraseError && <p className="text-red-500 bg-red-100 p-2 rounded-md">{phraseError}</p>}
          {phraseLoading && <LoadingSpinner text="Sugerindo frases..." className="my-4" />}
          {suggestedPhrases && !phraseLoading && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-md">
              <h4 className="font-semibold text-slate-700 mb-2">Frases Sugeridas:</h4>
              <Textarea value={suggestedPhrases} readOnly rows={10} className="bg-white text-sm" />
            </div>
          )}
        </div>
      </Card>

      <Card title="Verificador de Plágio (Demonstração)" titleClassName="bg-red-50">
        <p className="text-slate-600">
          Um verificador de plágio robusto requer integrações complexas. Esta é uma área para desenvolvimento futuro.
          Por enquanto, você pode usar a IA para comparar trechos de texto com fontes conhecidas ou pedir para reescrever seções para originalidade (usando as ferramentas acima).
        </p>
        {/* Placeholder for future plagiarism check UI */}
      </Card>
    </div>
  );
};