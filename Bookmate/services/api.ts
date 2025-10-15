import { Book } from "../types/Book";

// Type aliases
type ScoredBook = Book & { score?: number };
type SimilarBook = Book & { similarity?: number };

// 🟢 Change this to your PC LAN IP where Python backend is running
const BASE_URL = "http://0.0.0.0:8000";//please change IP first the complie

/** Search books via Python backend */
export async function searchBooksByTitle(query: string, limit = 20): Promise<ScoredBook[]> {
  try {
    const res = await fetch(`${BASE_URL}/search-books?title=${encodeURIComponent(query)}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: ScoredBook[] = await res.json();
    return data;
  } catch (err) {
    console.error("searchBooksByTitle API error:", err);
    return [];
  }
}

/** Fetch book details via Python backend */
export async function fetchBookDetails(bookKey: string): Promise<Book | null> {
  try {
    const res = await fetch(`${BASE_URL}/book-details?key=${encodeURIComponent(bookKey)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: Book = await res.json();
    return data;
  } catch (err) {
    console.error("fetchBookDetails API error:", err);
    return null;
  }
}

/** Fetch similar books via Python backend (returns similarity score) */
export async function fetchSimilarBooks(bookKey: string, limit = 12): Promise<SimilarBook[]> {
  try {
    const res = await fetch(`${BASE_URL}/similar-books?key=${encodeURIComponent(bookKey)}&limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: SimilarBook[] = await res.json();
    return data;
  } catch (err) {
    console.error("fetchSimilarBooks API error:", err);
    return [];
  }
}
