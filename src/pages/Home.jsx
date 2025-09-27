import { useState, useRef, useEffect } from "react";
import MessageBubble from "../components/MessageBubble";
import useSpeechRecognition from "../hooks/useSpeechRecognition"; 

export default function Home() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved
      ? JSON.parse(saved)
      : [{ role: "assistant", content: "Hey! I'm Rome, your workflow co-pilot." }];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Speech Recognition
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Speak assistant replies out loud
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };



  // send message to backend
  const sendMessage = async (userInput = input, fromVoice = false) => {
    if (!userInput.trim()) return;

    const newMessages = [
      ...messages,
      { role: "user", content: userInput, voice: fromVoice },
    ];
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));
    setInput("");
    resetTranscript?.();
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      const reply =
        data.choices?.[0]?.message?.content ||
        data.choices?.[0]?.text ||
        "No response from Groq";

      const updated = [...newMessages, { role: "assistant", content: reply }]; 
      setMessages(updated);
      localStorage.setItem("chatMessages", JSON.stringify(updated));
      speak(reply);
    } catch (err) {
      console.error("Error calling backend:", err);
      const updated = [
        ...newMessages,
        { role: "assistant", content: "Error calling API" },
      ];
      setMessages(updated);
      localStorage.setItem("chatMessages", JSON.stringify(updated));
    } finally {
      setIsTyping(false);
    }
  };

  // Automatically send voice input when user stops speaking
  useEffect(() => {
    if (transcript && !listening) {
      sendMessage(transcript, true);
    }
  }, [transcript, listening]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Clear chat history with confirmation
  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat?")) {
      const initialMsg = [
        { role: "assistant", content: "Hey! I'm Rome, your workflow co-pilot." },
      ];
      setMessages(initialMsg);
      localStorage.setItem("chatMessages", JSON.stringify(initialMsg));
    }
  };

  return (
    <div className="w-full max-w-2xl flex flex-col bg-white rounded-3xl shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg flex justify-between items-center">
        Rome AI Co-Pilot
        <div className="flex gap-2">
          <button
            onClick={listening ? stopListening : startListening}
            className={`px-3 py-1 rounded-full text-sm ${
              listening ? "bg-red-500 text-white" : "bg-white text-indigo-600"
            }`}
          >
            {listening ? "Stop" : "Speak"}
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-1 rounded-full text-sm bg-white text-indigo-600 hover:bg-indigo-100"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50"
        style={{ minHeight: "450px" }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            voice={msg.voice}
          />
        ))}

        {isTyping && <div className="text-gray-500 italic">Rome is typing...</div>}

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
          onClick={() => sendMessage()}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all shadow-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}
