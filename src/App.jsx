// src/App.jsx
import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import { Analytics } from '@vercel/analytics/react';
import './App.css';

// Initialize the AI client outside of the component
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not defined. Please add it to your .env file");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

function App() {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState([]); // Store conversation history
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null); // Ref to scroll to the end of the chat

  // Automatically scroll to the bottom when history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const fetchResponse = async () => {
    if (!prompt || loading) return;

    setLoading(true);
    setError(null);

    // Add user's prompt to history immediately
    const userPrompt = { role: 'user', text: prompt };
    setHistory(prev => [...prev, userPrompt]);
    setPrompt(""); // Clear the input field

    try {
      const result = await model.generateContent(prompt);
      const geminiResponse = result.response;
      const aiResponse = { role: 'ai', text: geminiResponse.text() };
      setHistory(prev => [...prev, aiResponse]);
    } catch (e) {
      console.error("An error occurred:", e);
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevents adding a new line
        fetchResponse();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-history">
        {history.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="avatar">{message.role === 'user' ? '🧑' : '🤖'}</div>
            <div className="text">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message ai loading-message">
             <div className="avatar">🤖</div>
             <div className="text"><span></span><span></span><span></span></div>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div ref={chatEndRef} />
      </div>
      <div className="prompt-area">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your prompt here..."
          disabled={loading}
        />
        <button onClick={fetchResponse} disabled={loading || !prompt}>
          {loading ? '...' : '➤'}
        </button>
      </div>
      <Analytics />
    </div>
  );
}

export default App;