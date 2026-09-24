import { useState } from "react";
import "./Chatbot.css";
import ReactMarkdown from "react-markdown";


const API_URL = "https://cgdata-backend.onrender.com/api/chat";

const languages = [
  { value: "Hinglish", label: "Hinglish" },
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिंदी" },
  { value: "Chhattisgarhi", label: "छत्तीसगढ़ी" },
];

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("Hinglish");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! 👋 Main CG DATA AI Assistant hoon. Aap Chhattisgarh ke districts, tourism, agriculture, food, culture aur other CG DATA information ke baare mein pooch sakte hain.",
    },
  ]);

  const sendMessage = async () => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    const userMessage = {
      role: "user",
      text: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: trimmedQuestion,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            "Unable to get response from CG DATA AI."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            "Sorry, abhi AI response nahi mil pa raha. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        text: "Chat clear ho gayi. Aap CG DATA ke baare mein kuch bhi pooch sakte hain.",
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className={`chatbot-floating-button ${
          isOpen ? "chatbot-button-open" : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open CG DATA AI Assistant"
      >
        {isOpen ? "×" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-container">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">CG</div>

              <div>
                <h3>CG DATA AI</h3>
                <span>
                  <span className="online-dot"></span>
                  Online
                </span>
              </div>
            </div>

            <button
              className="chatbot-clear-button"
              onClick={clearChat}
              title="Clear chat"
            >
              Clear
            </button>
          </div>

          {/* Language */}
          <div className="chatbot-language">
            <label htmlFor="chat-language">Language</label>

            <select
              id="chat-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              {languages.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`chat-message ${
                  message.role === "user"
                    ? "chat-message-user"
                    : "chat-message-ai"
                }`}
              >
                <div className="chat-message-label">
                  {message.role === "user" ? "You" : "CG DATA AI"}
                </div>

                <div
                  className={`chat-message-bubble ${
                    message.error ? "chat-message-error" : ""
                  }`}
                >
                <ReactMarkdown>{message.text}</ReactMarkdown>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message chat-message-ai">
                <div className="chat-message-label">CG DATA AI</div>

                <div className="chat-message-bubble chatbot-loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Chhattisgarh..."
              rows="1"
              disabled={loading}
            />

            <button
              className="chatbot-send-button"
              onClick={sendMessage}
              disabled={!question.trim() || loading}
              aria-label="Send message"
            >
              ➤
            </button>
          </div>

          <div className="chatbot-footer">
            Powered by CG DATA • Information from CG DATA
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
