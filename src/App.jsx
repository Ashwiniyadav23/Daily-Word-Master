import React, { useEffect, useState } from "react";
import WordCard from "./Components/WordCard";
import Quiz from "./Components/quiz.jsx";

function App() {
  const [data, setData] = useState("");
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    setQuizStarted(false); // Reset quiz on level change
    fetch(`https://word-backend-black.vercel.app/api/word?level=${level}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((res) => {
        setData(res.wordData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [level]);

  const startQuiz = () => setQuizStarted(true);
  const goBack = () => setQuizStarted(false);

  return (
    <div className="app-container">
      <h1 className="title">Word of the Day</h1>

      <div className="level-selector">
        <label htmlFor="level">Choose Level:</label>
        <select
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="select-level"
          disabled={quizStarted} // Disable level select while quiz started
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && data && (
        <>
          {!quizStarted ? (
            <>
              <WordCard rawText={data} />
              <div className="start-quiz-container">
                <button className="start-quiz-btn" onClick={startQuiz}>
                  Start Quiz
                </button>
              </div>
            </>
          ) : (
            <Quiz rawText={data} onBack={goBack} />
          )}
        </>
      )}

     
<style>{`
        .app-container {
          max-width: 720px;
          margin: 3rem auto;
          padding: 2rem 2.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f8fa;
          border-radius: 16px;
          box-shadow: 0 12px 24px rgba(44, 62, 80, 0.15);
          color: #2c3e50;
          transition: background-color 0.3s ease;
          animation: fadeIn 0.7s ease forwards;
        }
        .title {
          text-align: center;
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          margin-bottom: 2rem;
          color: #34495e;
          user-select: none;
        }
        .level-selector {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2.5rem;
          font-size: 1.2rem;
          color: #34495e;
          user-select: none;
        }
        .select-level {
          padding: 0.5rem 1.2rem;
          border-radius: 8px;
          border: 1.8px solid #aab2bd;
          font-size: 1.1rem;
          font-weight: 600;
          color: #34495e;
          background-color: #fff;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .select-level:hover:not(:disabled),
        .select-level:focus:not(:disabled) {
          border-color: #5d6d7e;
          box-shadow: 0 0 6px rgba(93,109,126,0.4);
          outline: none;
        }
        .loading {
          text-align: center;
          font-style: italic;
          color: #7f8c8d;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .error {
          color: #c0392b;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          user-select: none;
        }
        .start-quiz-container {
          text-align: center;
          margin-top: 2rem;
        }
        .start-quiz-btn {
          padding: 0.8rem 2.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          background-color: #34495e;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
          box-shadow: 0 6px 12px rgba(52, 73, 94, 0.3);
        }
        .start-quiz-btn:hover {
          background-color: #2c3e50;
          transform: scale(1.05);
        }
        .start-quiz-btn:active {
          transform: scale(0.98);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
