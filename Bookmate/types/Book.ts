export interface Book {
  key: string;
  title: string;
  author_name?: string[];               // used by search results
  authors?: { name: string }[];         // used by works/details
  cover_edition_key?: string;
  coverUrl?: string | null;
  publish_date?: string;
  score?: number;// for search relevance
  similarity?: number;  // for similar books
}

export interface BookDetails {
  title: string;
  authors: { name: string }[];
  publish_date?: string;
  subjects?: string[];
  coverUrl?: string;
  cover_edition_key?: string;
}
