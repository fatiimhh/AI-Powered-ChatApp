import { useState, useEffect } from "react";

export default function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onend = () => setListening(false);

    if (listening) recognition.start();

    return () => recognition.stop();
  }, [listening]);

  const startListening = () => setListening(true);
  const stopListening = () => setListening(false);
  const resetTranscript = () => setTranscript("");

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
  };
}
