import { useState, useRef, useEffect } from "react";
import MessageBubble from "../components/MessageBubble";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hey! I'm Rome, your workflow co-pilot." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // typing state
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true); // show typing indicator

    try {
      const res = await fetch("http://localhost:5000/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      // Extract Groq reply with safe fallbacks
      const reply =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        JSON.stringify(data) ||
        "No response from Groq";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Error calling backend:", err);
      setMessages([...newMessages, { role: "assistant", content: "Error calling API ❌" }]);
    } finally {
      setIsTyping(false); // hide typing indicator
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="w-full max-w-2xl flex flex-col bg-white rounded-3xl shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg">
        Rome AI Co-Pilot
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50"
        style={{ minHeight: "450px" }}
      >
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} content={msg.content} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-gray-500 italic">Rome is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex p-4 border-t bg-white gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 border rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
