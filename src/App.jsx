import { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
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
  const [history, setHistory] = useState([]); // Manages the full conversation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  // Automatically scroll to the bottom when history changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // --- This is the properly implemented streaming function ---
  const fetchResponse = async () => {
    if (!prompt || loading) return;

    setLoading(true);
    setError(null);

    const userPrompt = { role: 'user', text: prompt };
    const aiResponsePlaceholder = { role: 'ai', text: "" };
    setHistory(prev => [...prev, userPrompt, aiResponsePlaceholder]);
    setPrompt("");

    try {
        // Corrected line: Removed 'await'
        const streamRes = await model.generateContentStream(prompt);
        const stream = streamRes.stream;
        console.log('The object returned by generateContentStream is:', stream);
        
        let fullText = "";
        for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullText += chunkText;

            setHistory(prev => {
                const newHistory = [...prev];
                const lastMessageIndex = newHistory.length - 1;
                newHistory[lastMessageIndex] = { ...newHistory[lastMessageIndex], text: fullText };
                return newHistory;
            });
        }
    } catch (e) {
        console.error("An error occurred:", e);
        setError("Sorry, something went wrong. Please try again.");
        setHistory(prev => {
            const newHistory = [...prev];
            const lastMessageIndex = newHistory.length - 1;
            newHistory[lastMessageIndex].text = "Error: Could not get a response.";
            return newHistory;
        });
    } finally {
        setLoading(false);
    }
};
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
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
              {/* Render the AI placeholder as a loading animation while its text is empty and loading is true */}
              {message.role === 'ai' && loading && index === history.length - 1 && message.text === "" ? (
                  <div className="loading-animation"><span></span><span></span><span></span></div>
              ) : (
                  <ReactMarkdown>{message.text}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {error && !loading && <div className="error-message">{error}</div>}
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
    </div>
  );
}

export default App;