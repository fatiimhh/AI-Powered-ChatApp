import { useState, useEffect } from "react";

export default function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  // initialize SpeechRecognition and set up event handlers 
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US"; // will add more language support later

    // update transcript state when speech is recognized
    recognition.onresult = (event) => { 
      setTranscript(event.results[0][0].transcript);
    };

    recognition.onend = () => setListening(false);

    if (listening) recognition.start();

    return () => recognition.stop();
  }, [listening]);

  return {
    transcript,
    listening,
    startListening: () => setListening(true), // function to start listening
  };
}
