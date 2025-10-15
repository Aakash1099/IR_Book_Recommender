from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow CORS from all origins (needed for React Native / Expo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility functions
def jaccard(a: str, b: str) -> float:
    set_a = set(a.lower().split())
    set_b = set(b.lower().split())
    inter = len(set_a & set_b)
    uni = len(set_a | set_b)
    return inter / uni if uni > 0 else 0

# --- 1️⃣ Search Books by Title ---
@app.get("/search-books")
def search_books(title: str = Query(...), limit: int = 20):
    try:
        res = requests.get("https://openlibrary.org/search.json", params={"title": title, "limit": max(limit, 50)}, timeout=5)
        res.raise_for_status()
        docs = res.json().get("docs", [])

        # dominant author logic
        author_count = {}
        for d in docs:
            a = d.get("author_name", [None])[0]
            if a: author_count[a] = author_count.get(a, 0) + 1
        top_author = max(author_count, key=lambda k: author_count[k], default="") if author_count else ""
        top_author_exists = bool(top_author and author_count[top_author] > 1)

        books = []
        for d in docs:
            if not d.get("title") or not d.get("key"):
                continue
            title_sim = jaccard(title, d["title"])
            author0 = d.get("author_name", [None])[0]
            author_boost = 0.4 if top_author_exists and author0 and author0.lower() == top_author.lower() else 0
            score = min(1, title_sim*0.6 + author_boost + jaccard(title, f'{d["title"]} {author0 or ""}')*0.4)
            books.append({
                "key": d["key"],
                "title": d["title"],
                "author_name": d.get("author_name"),
                "cover_edition_key": d.get("cover_edition_key"),
                "coverUrl": f'https://covers.openlibrary.org/b/id/{d.get("cover_i")}-M.jpg' if d.get("cover_i") else None,
                "publish_date": str(d.get("first_publish_year")) if d.get("first_publish_year") else None,
                "score": score
            })
        books.sort(key=lambda x: x["score"], reverse=True)
        return books[:limit]

    except Exception as e:
        return {"error": str(e)}

# --- 2️⃣ Book Details by Key ---
@app.get("/book-details")
def book_details(key: str = Query(...)):
    try:
        res = requests.get(f"https://openlibrary.org{key}.json", timeout=5)
        res.raise_for_status()
        data = res.json()

        authors = []
        for a in data.get("authors", []):
            if "name" in a:
                authors.append({"name": a["name"]})
        return {
            "key": data.get("key"),
            "title": data.get("title"),
            "authors": authors if authors else None,
            "publish_date": data.get("first_publish_date") or data.get("publish_date"),
            "coverUrl": f'https://covers.openlibrary.org/b/id/{data["covers"][0]}-L.jpg' if data.get("covers") else None
        }

    except Exception as e:
        return {"error": str(e)}

# --- 3️⃣ Similar Books ---
@app.get("/similar-books")
def similar_books(key: str = Query(...), limit: int = 12):
    try:
        work_res = requests.get(f"https://openlibrary.org{key}.json", timeout=5)
        work_res.raise_for_status()
        work = work_res.json()
        subjects = work.get("subjects", [])
        original_title = work.get("title", "")

        if not subjects:
            # fallback: search by title
            search_res = requests.get(f"http://localhost:8000/search-books?title={original_title}&limit={limit}")
            search_res.raise_for_status()
            return search_res.json()

        main_subject = subjects[0]
        subject_slug = main_subject.lower().replace(" ", "_")
        subj_res = requests.get(f"https://openlibrary.org/subjects/{subject_slug}.json?limit={limit}", timeout=5)
        subj_res.raise_for_status()
        works = subj_res.json().get("works", [])

        candidates = []
        for w in works:
            if not w.get("title") or not w.get("key"):
                continue
            title_sim = jaccard(original_title, w["title"])
            score = min(1, 0.6*1.0 + 0.4*title_sim)
            candidates.append({
                "key": w["key"],
                "title": w["title"],
                "author_name": [a.get("name") for a in w.get("authors", []) if a.get("name")] if w.get("authors") else None,
                "coverUrl": f'https://covers.openlibrary.org/b/id/{w.get("cover_id")}-M.jpg' if w.get("cover_id") else None,
                "publish_date": str(w.get("first_publish_year")) if w.get("first_publish_year") else None,
                "similarity": score
            })
        candidates.sort(key=lambda x: x["similarity"], reverse=True)
        return candidates[:limit]

    except Exception as e:
        return {"error": str(e)}
