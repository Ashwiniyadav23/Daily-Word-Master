import React, { useState } from "react";

function Quiz({ rawText, onBack }) {
  const questions = rawText.split("\n").slice(3).filter(Boolean);

  const parsedQuestions = questions.map((line) => {
    const match = line.match(/^(.*?) \(A\) (.*?) \(B\) (.*?) \(C\) (.*?) \(D\) (.*)$/);
    return match
      ? {
          question: match[1],
          options: [match[2], match[3], match[4], match[5]],
          correct: match[5], // Assume last option is correct
        }
      : null;
  }).filter(Boolean);

  const [answers, setAnswers] = useState(Array(parsedQuestions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx, opt) => {
    if (submitted) return;
    const newAns = [...answers];
    newAns[qIdx] = opt;
    setAnswers(newAns);
  };

  const handleSubmit = () => setSubmitted(true);

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h3> Quiz Time!</h3>
        <button className="back-btn" onClick={onBack}>← Back</button>
      </div>

      {parsedQuestions.map((q, i) => (
        <div key={i} className="quiz-question">
          <p className="question-text">{i + 1}. {q.question}</p>
          <div className="options">
            {q.options.map((opt, j) => {
              const selected = answers[i] === opt;
              let className = "option-btn";
              if (submitted) {
                if (opt === q.correct) className += " correct";
                else if (selected) className += " wrong";
              } else if (selected) {
                className += " selected";
              }
              return (
                <button
                  key={j}
                  className={className}
                  onClick={() => handleSelect(i, opt)}
                  disabled={submitted}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className={`feedback ${answers[i] === q.correct ? "correct-text" : "wrong-text"}`}>
              {answers[i] === q.correct
                ? "✅ Correct"
                : `❌ Wrong. Correct answer: ${q.correct}`}
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button className="submit-btn" onClick={handleSubmit} disabled={answers.includes(null)}>
          Submit Answers
        </button>
      )}

      {submitted && (
        <p className="score">
          🎯 Your Score: {answers.filter((a, i) => a === parsedQuestions[i].correct).length} / {parsedQuestions.length}
        </p>
      )}

      <style>{`
        .quiz-container {
          max-width: 720px;
          margin: 2rem auto;
          background: #fefefe;
          padding: 2.5rem 3rem;
          border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.12);
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          color: #222;
          user-select: none;
          animation: fadeIn 0.7s ease forwards;
        }
        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.7rem;
        }
        .quiz-header h3 {
          font-weight: 700;
          font-size: 1.8rem;
          color: #0a3d62;
          letter-spacing: 1.2px;
        }
        .back-btn {
          background-color: #0984e3;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border: none;
          padding: 0.6rem 1.3rem;
          border-radius: 30px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(9,132,227,0.4);
          transition: background-color 0.3s ease, transform 0.15s ease;
          user-select: none;
        }
        .back-btn:hover {
          background-color: #74b9ff;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(116,185,255,0.6);
        }
        .back-btn:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .quiz-question {
          margin-bottom: 2rem;
          padding: 1.5rem 1.8rem;
          border-radius: 18px;
          background: #f7f9fc;
          box-shadow: 0 6px 20px rgba(33,33,33,0.07);
          transition: box-shadow 0.3s ease;
        }
        .quiz-question:hover {
          box-shadow: 0 10px 30px rgba(33,33,33,0.12);
        }
        .question-text {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #2d3436;
          text-shadow: 0 1px 1px rgba(255,255,255,0.6);
        }
        .options {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .option-btn {
          flex: 1 1 calc(50% - 1rem);
          padding: 0.8rem 1.2rem;
          border-radius: 16px;
          background: #dfe6e9;
          border: 2px solid transparent;
          color: #2d3436;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
          user-select: none;
          text-align: center;
          min-width: 140px;
        }
        .option-btn:hover:not(:disabled) {
          background: #74b9ff;
          color: white;
          box-shadow: 0 4px 15px rgba(116,185,255,0.6);
          transform: translateY(-3px);
        }
        .option-btn.selected {
          background: #0984e3;
          border-color: #0652dd;
          color: white;
          box-shadow: 0 6px 25px rgba(9,132,227,0.7);
        }
        .option-btn.correct {
          background-color: #00b894;
          border-color: #009973;
          color: white;
          box-shadow: 0 8px 30px rgba(0,184,148,0.8);
          cursor: default;
        }
        .option-btn.wrong {
          background-color: #d63031;
          border-color: #b71c1c;
          color: white;
          box-shadow: 0 8px 30px rgba(214,48,49,0.8);
          cursor: default;
        }
        .feedback {
          margin-top: 0.8rem;
          font-weight: 600;
          font-size: 1rem;
          animation: fadeIn 0.5s ease;
          user-select: text;
        }
        .correct-text {
          color: #00b894;
        }
        .wrong-text {
          color: #d63031;
        }
        .submit-btn {
          display: block;
          margin: 3rem auto 1rem;
          padding: 1rem 3.5rem;
          background-color: #0984e3;
          color: white;
          font-weight: 700;
          font-size: 1.1rem;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(9,132,227,0.5);
          transition: background-color 0.3s ease, transform 0.15s ease;
          user-select: none;
        }
        .submit-btn:disabled {
          background-color: #b2bec3;
          cursor: not-allowed;
          box-shadow: none;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #74b9ff;
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(116,185,255,0.8);
        }
        .score {
          text-align: center;
          font-size: 1.6rem;
          font-weight: 700;
          margin-top: 2rem;
          color: #0984e3;
          letter-spacing: 1.2px;
          animation: popIn 0.7s ease;
          user-select: text;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Quiz;
