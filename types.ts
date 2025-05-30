
export interface Article {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  url?: string;
  notes?: string;
  filePath?: string; // For potential file uploads, not fully implemented
  summary?: string; // AI generated summary
}

export interface Reference {
  id: string;
  authors: string; // e.g., "SOBRENOME, Nome A.; SOBRENOME, Nome B." or "Author, A. A., & Author, B. B."
  year: string;
  title: string;
  source: string; // e.g., "Journal Name, Vol(Issue), pages" or "City: Publisher"
  doi?: string;
  // ABNT specific
  abntType?: 'book' | 'article' | 'thesis' | 'online';
  edition?: string; // For ABNT book
  local?: string; // For ABNT book/thesis
  publisher?: string; // For ABNT book
  pages?: string; // For ABNT article/book chapter
  // APA specific
  journalVolume?: string;
  journalIssue?: string;
  journalPages?: string;
}

export const CitationStyle = {
  ABNT: "ABNT",
  APA: "APA",
} as const;

export type CitationStyleType = typeof CitationStyle[keyof typeof CitationStyle];


export interface Task {
  id: string;
  description: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId?: string; // Link to a project if implementing multi-project
}

export interface ProjectGoal {
  id: string;
  description: string;
  isAchieved: boolean;
}

export type NavItemKey = 'dashboard' | 'literature' | 'writing' | 'organization' | 'formatting';
