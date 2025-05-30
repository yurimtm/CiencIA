
import { NavItemKey } from './types';

export const APP_TITLE = "Assistente de Pesquisa Científica IA";

export const GEMINI_TEXT_MODEL = "gemini-2.5-flash-preview-04-17";

export interface NavItem {
  key: NavItemKey;
  label: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}

// Heroicons (Outline) SVGs as functions
const AcademicCapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.25c2.472 0 4.796-.438 6.986-1.245a60.438 60.438 0 0 0-.49-6.347m-5.432 8.373A48.61 48.61 0 0 1 12 20.25c-2.472 0-4.796-.438-6.986-1.245m13.972-8.373L12 10.146M12 10.146L6.74 7.46M12 10.146l5.26 2.686m0 0L21.26 7.46m-6.522 2.686L12 3.75m0 0L12.002 2.25m0 1.5L12 3.75M3.75 15.375c0-2.25 3.363-4.063 7.5-4.063s7.5 1.813 7.5 4.063m0 0H20.25M3.75 15.375H1.75m18.5 0H22.25m-20.5 0H1.75" />
  </svg>
);

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0v14.25" />
  </svg>
);

const PencilSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

const ListBulletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const WrenchScrewdriverIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.83-5.83M11.42 15.17l2.472-2.472a3.75 3.75 0 0 0-5.303-5.303L6 11.42m5.83 5.83L8.477 21m6.196-12.576L15.17 11.42M6 11.42l5.83-5.83m0 0L8.477 3M3 3l3.523 3.523" />
  </svg>
);


export const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Painel', path: '/', icon: AcademicCapIcon },
  { key: 'literature', label: 'Literatura', path: '/literature', icon: BookOpenIcon },
  { key: 'writing', label: 'Escrita', path: '/writing', icon: PencilSquareIcon },
  { key: 'organization', label: 'Organização', path: '/organization', icon: ListBulletIcon },
  { key: 'formatting', label: 'Formatação', path: '/formatting', icon: WrenchScrewdriverIcon },
];
