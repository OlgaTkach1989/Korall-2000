import { useState } from "react";
import { sendChatbotMessage } from "../api/shop";
import { useI18n } from "../context/I18nContext";

const ChatbotWidget = () => {
  const { language } = useI18n();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text:
        language === "de"
          ? "Hallo! Ich bin Ihr Shop-Assistent. Fragen Sie nach Produkten, Versand oder Bestellstatus."
          : "Hi! I am your shop assistant. Ask me about products, shipping, or order status.",
    },
  ]);
  const [suggestions, setSuggestions] = useState(["Versandkosten", "Lieferzeit"]);

  const ask = async (text) => {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendChatbotMessage({ message: question, language });
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            language === "de"
              ? "Der Chatbot ist gerade nicht erreichbar. Bitte spaeter erneut versuchen."
              : "The chatbot is currently unavailable. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot">
      {open ? (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <strong>{language === "de" ? "Shop Assistent" : "Shop Assistant"}</strong>
            <button type="button" onClick={() => setOpen(false)}>
              x
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "chatbot-msg user" : "chatbot-msg bot"}
              >
                {message.text}
              </div>
            ))}
          </div>

          {suggestions.length > 0 ? (
            <div className="chatbot-suggestions">
              {suggestions.slice(0, 3).map((item) => (
                <button key={item} type="button" onClick={() => ask(item)}>
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="chatbot-input"
            onSubmit={(event) => {
              event.preventDefault();
              ask(input);
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                language === "de"
                  ? "Frage eingeben..."
                  : "Type your question..."
              }
            />
            <button type="submit" disabled={loading}>
              {loading ? "..." : language === "de" ? "Senden" : "Send"}
            </button>
          </form>
        </div>
      ) : null}

      <button type="button" className="chatbot-toggle" onClick={() => setOpen((prev) => !prev)}>
        {language === "de" ? "Chat" : "Chat"}
      </button>
    </div>
  );
};

export default ChatbotWidget;
