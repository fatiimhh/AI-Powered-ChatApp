// components/MessageBubble.jsx
import { motion } from "framer-motion";

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-3 text-base leading-relaxed break-words
          ${isUser
            ? "bg-indigo-600 text-white rounded-2xl rounded-br-none shadow-md"
            : "bg-white border text-gray-800 rounded-2xl rounded-bl-none shadow-sm"
          }
        `}
      >
        {content}
      </div>
    </motion.div>
  );
}
