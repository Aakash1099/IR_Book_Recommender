# IR_Book_Recommender
BookMate is an intelligent book recommendation app using Jaccard similarity and content-based filtering. It analyzes titles, authors, and subjects from OpenLibrary to suggest similar books with relevance scores. Built with React Native, it offers smart, personalized, and seamless reading recommendations for every book lover.

to run backend first
"uvicorn main:app --host 0.0.0.0 --port 8000"

change Ip address to you ip address in services api.ts

// 🟢 Change this to your PC LAN IP where Python backend is running
const BASE_URL = "http://0.0.0.0:8000";

To Start react native "npx expo start"

BookMate is an intelligent book recommendation system designed to help users discover similar and relevant books effortlessly. It leverages advanced information retrieval techniques such as Jaccard similarity and content-based filtering to analyze relationships between book titles, authors, and subjects. By comparing tokenized text data, the system calculates similarity scores that reflect how closely related two books are in terms of content and metadata.

The backend, powered by Python, runs periodic cron jobs to fetch, preprocess, and update book data from the OpenLibrary API, ensuring that recommendations stay accurate and up to date. The frontend is built using React Native, providing a seamless and responsive interface optimized for both mobile and web users.

BookMate’s recommendation engine intelligently ranks results based on textual similarity and author prominence, displaying a visually engaging layout similar to Netflix-style carousels for better user interaction. Users can explore book details, view cover images, and navigate through related works effortlessly.

By combining machine learning-inspired text similarity, modern frontend design, and automated backend workflows, BookMate delivers a smart, scalable, and open-source solution for personalized book discovery, ideal for students, researchers, and readers seeking a better way to find their next favorite read.