// src/types/navigation.ts

export type RootStackParamList = {
  Search: undefined;
  BookDetails: {
    bookKey: string;
    bookTitle?: string;
  };
};
