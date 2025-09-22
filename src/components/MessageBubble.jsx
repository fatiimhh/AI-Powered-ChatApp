import { motion } from "framer-motion";
import { Mic } from "lucide-react"; 

export default function MessageBubble({ role, content, voice = false }) {
  const isUser = role === "user";
 
  // animate message bubble appearance
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[70%] px-4 py-3 text-base leading-relaxed break-words flex items-center gap-2
          ${isUser
            ? "bg-indigo-600 text-white rounded-2xl rounded-br-none shadow-md"
            : "bg-white border text-gray-800 rounded-2xl rounded-bl-none shadow-sm"
          }
        `}
      >
        {content}

        {/* Voice badge */}
        {voice && (
          <Mic
            size={16}
            className={`ml-1 ${
              isUser ? "text-indigo-200" : "text-indigo-500"
            }`}
          />
        )}
      </div>
    </motion.div>
  );
}
