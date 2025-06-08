import React, { useState, useRef, useEffect } from "react";

function WordCard({ rawText }) {
  const lines = rawText.split("\n");
  const word = lines[0]?.replace("Word:", "").trim();
  const meaning = lines[1]?.replace("Meaning:", "").trim();
  const example = lines[2]?.replace("Example sentence:", "").trim();

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef(null);

  const [listening, setListening] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    if (!SpeechRecognition) {
      setResultMessage("Speech Recognition not supported in this browser.");
      console.warn("Speech Recognition API not supported");
    }
  }, [SpeechRecognition]);

  const startListening = () => {
    if (!SpeechRecognition) {
      setResultMessage("Speech Recognition not supported in this browser.");
      return;
    }

    try {
      recognition.current = new SpeechRecognition();
    } catch (err) {
      setResultMessage("Error initializing Speech Recognition: " + err.message);
      console.error(err);
      return;
    }

    setListening(true);
    setResultMessage("Listening... Please say the word.");

    recognition.current.lang = "en-US";
    recognition.current.interimResults = false;
    recognition.current.maxAlternatives = 1;

    recognition.current.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript.trim().toLowerCase();
      console.log("Recognized:", spokenWord);

      if (spokenWord === word.toLowerCase()) {
        setResultMessage(`✅ Correct pronunciation: you said "${spokenWord}"`);
      } else {
        setResultMessage(`❌ Incorrect pronunciation: you said "${spokenWord}" but expected "${word}"`);
      }
      setListening(false);
    };

    recognition.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      if(event.error === "not-allowed" || event.error === "permission-denied"){
        setResultMessage("Microphone permission denied. Please allow microphone access.");
      } else {
        setResultMessage("Error: " + event.error);
      }
      setListening(false);
    };

    recognition.current.onend = () => {
      console.log("Speech recognition ended");
      setListening(false);
    };

    recognition.current.start();
  };

  const pronounceWord = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="word-card">
      <h2>{word}</h2>
      <p><strong>Meaning:</strong> {meaning}</p>
      <p><strong>Example:</strong> {example}</p>

      <div className="controls">
        <button onClick={pronounceWord} disabled={listening}>
          Pronounce Word
        </button>
        <button onClick={startListening} disabled={listening}>
          Speak Word to Check
        </button>
      </div>

      <p className="result-message">{resultMessage}</p>

       <style>{`
        .word-card {
          background: #f9fafb;
          border: 1.5px solid #c1c7cd;
          border-radius: 14px;
          padding: 2rem;
          box-shadow: 0 4px 15px rgba(100, 116, 139, 0.15);
          margin-bottom: 2.5rem;
          color: #2f3e4e;
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          cursor: default;
          animation: fadeInUp 0.6s ease forwards;
        }

        .word-card:hover {
          box-shadow: 0 8px 30px rgba(45, 55, 72, 0.3);
          transform: translateY(-5px);
        }

        .word-card h2 {
          margin-bottom: 1.2rem;
          font-weight: 700;
          font-size: 2rem;
          color: #1a2e45;
          letter-spacing: 0.04em;
          text-shadow: 0 1px 1px rgba(0,0,0,0.05);
        }

        .word-card p {
          font-size: 1.15rem;
          line-height: 1.6;
          margin-bottom: 0.8rem;
          color: #4b5563;
          letter-spacing: 0.02em;
        }

        .word-card p strong {
          color: #344155;
        }

        .controls {
          margin-top: 1rem;
        }

        .controls button {
          font-size: 1rem;
          padding: 0.5rem 1rem;
          margin-right: 1rem;
          border-radius: 8px;
          border: 1.5px solid #3b82f6;
          background: #3b82f6;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .controls button:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
          border-color: #a5b4fc;
        }

        .controls button:hover:not(:disabled) {
          background: #2563eb;
          border-color: #2563eb;
        }

        .result-message {
          max-width: 520px;
          margin: 1.5rem auto 0 auto;
          font-size: 1.1rem;
          font-weight: 600;
          color: #111827;
          text-align: center;
          min-height: 1.4em;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
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

export default WordCard;
