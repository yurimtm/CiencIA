
import React, { useState, useEffect } from 'react';
import { Reference, CitationStyle, CitationStyleType } from '../types.ts';
import { Card } from '../components/common/Card.tsx';
import { generateText } from '../services/geminiService.ts';
import { LoadingSpinner } from '../components/common/LoadingSpinner.tsx';
import { Select } from '../components/common/Select.tsx';
import { Button } from '../components/common/Button.tsx';

interface FormattingPageProps {
  references: Reference[]; // Pass all references to potentially format them
  citationStyle: CitationStyleType; // Default style from App state
}

const formatReference = (ref: Reference, style: CitationStyleType): string => {
  // Simplified formatting logic. A real implementation would be much more complex.
  if (style === CitationStyle.APA) {
    // APA: Author, A. A., Author, B. B., & Author, C. C. (Year). Title of article. *Title of Periodical, volume number*(issue number), pages.
    // Simplified APA: Authors (Year). Title. Source.
    return `${ref.authors} (${ref.year}). ${ref.title}. ${ref.source}. ${ref.doi ? `doi:${ref.doi}` : ''}`;
  }
  if (style === CitationStyle.ABNT) {
    // ABNT (Article): SOBRENOME, Nome A.; SOBRENOME, Nome B. Título do artigo. Título da Revista, Local, v. X, n. X, p. X-X, Mês. Ano.
    // Simplified ABNT: AUTHORS. Title. Source, Year.
    const authorsUpper = ref.authors.toUpperCase(); // Basic ABNT author capitalization
    return `${authorsUpper}. ${ref.title}. ${ref.source}, ${ref.year}. ${ref.doi ? `Disponível em: doi:${ref.doi}` : ''}`;
  }
  return "Estilo de formatação não suportado.";
};

export const FormattingPage: React.FC<FormattingPageProps> = ({ references, citationStyle: initialStyle }) => {
  const [guideContent, setGuideContent] = useState<string>('');
  const [loadingGuide, setLoadingGuide] = useState<boolean>(false);
  const [guideError, setGuideError] = useState<string | null>(null);
  const [selectedStyleForGuide, setSelectedStyleForGuide] = useState<CitationStyleType>(initialStyle);
  const [selectedStyleForBibliography, setSelectedStyleForBibliography] = useState<CitationStyleType>(initialStyle);

  const fetchFormattingGuide = async (style: CitationStyleType) => {
    setLoadingGuide(true);
    setGuideError(null);
    setGuideContent('');
    try {
      const prompt = `Forneça um guia conciso sobre como formatar referências bibliográficas no estilo ${style}, cobrindo os tipos mais comuns (artigo de periódico, livro, capítulo de livro). Destaque os principais elementos e a ordem correta.`;
      const result = await generateText(prompt, "Você é um especialista em normas de citação acadêmica.");
      setGuideContent(result);
    } catch (error) {
      setGuideError(`Falha ao carregar o guia de formatação para ${style}. Tente novamente.`);
      console.error("Formatting guide error:", error);
    } finally {
      setLoadingGuide(false);
    }
  };
  
  // Fetch guide on initial load or when style changes
  useEffect(() => {
    fetchFormattingGuide(selectedStyleForGuide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStyleForGuide]);

  const formattedBibliography = references
    .map(ref => formatReference(ref, selectedStyleForBibliography))
    .join('\n');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Ferramentas de Formatação</h1>

      <Card title="Guia de Estilos de Citação (Gerado por IA)">
        <div className="mb-4">
          <Select
            label="Selecione o Estilo para Ver o Guia:"
            value={selectedStyleForGuide}
            onChange={e => setSelectedStyleForGuide(e.target.value as CitationStyleType)}
            options={[
              { value: CitationStyle.APA, label: "APA (American Psychological Association)" },
              { value: CitationStyle.ABNT, label: "ABNT (Associação Brasileira de Normas Técnicas)" },
              // Add more styles as needed
            ]}
          />
        </div>
        {loadingGuide && <LoadingSpinner text={`Carregando guia para ${selectedStyleForGuide}...`} className="my-4" />}
        {guideError && <p className="text-red-500 bg-red-100 p-3 rounded-md">{guideError}</p>}
        {guideContent && !loadingGuide && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-md max-h-96 overflow-y-auto">
            <h4 className="font-semibold text-slate-700 mb-2">Guia Rápido: {selectedStyleForGuide}</h4>
            <pre className="whitespace-pre-wrap text-sm text-slate-600">{guideContent}</pre>
          </div>
        )}
      </Card>

      <Card title="Gerador de Bibliografia (Simplificado)">
        <p className="text-slate-600 mb-4">
          Esta é uma ferramenta simplificada. Para uma formatação precisa, sempre consulte os manuais de estilo oficiais.
          As referências devem ser adicionadas na seção 'Literatura'.
        </p>
        <div className="mb-4">
           <Select
            label="Selecione o Estilo para Gerar a Bibliografia:"
            value={selectedStyleForBibliography}
            onChange={e => setSelectedStyleForBibliography(e.target.value as CitationStyleType)}
            options={[
              { value: CitationStyle.APA, label: "APA" },
              { value: CitationStyle.ABNT, label: "ABNT" },
            ]}
          />
        </div>
        {references.length === 0 ? (
          <p className="text-slate-500">Nenhuma referência adicionada na seção 'Literatura' para gerar a bibliografia.</p>
        ) : (
          <div>
            <h4 className="font-semibold text-slate-700 mb-2">Bibliografia Formatada ({selectedStyleForBibliography}):</h4>
            <pre className="p-4 bg-slate-100 border border-slate-300 rounded-md text-sm text-slate-700 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {formattedBibliography || "Nenhuma referência para exibir."}
            </pre>
            <Button 
              onClick={() => navigator.clipboard.writeText(formattedBibliography)} 
              className="mt-3"
              disabled={!formattedBibliography}
            >
              Copiar Bibliografia
            </Button>
          </div>
        )}
      </Card>
      
      <Card title="Modelos de Documentos (Em Breve)">
        <p className="text-slate-500">
          Modelos de documentos pré-formatados (Word, LaTeX) para diferentes estilos (ABNT, APA) serão disponibilizados aqui.
        </p>
      </Card>
    </div>
  );
};
