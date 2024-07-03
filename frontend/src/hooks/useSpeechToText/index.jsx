import { useEffect, useRef, useState, createContext, useContext } from "react";

const SpeechRecognitionContext = createContext();

let recognition = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new window.webkitSpeechRecognition();
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.lang = "en-US";
}

const SpeechRecognitionProvider = ({ children }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [responseData, setResponseData] = useState("");

  const onResult = async (event) => {
    const length = event.results.length;

    let newText = event.results[length - 1][0].transcript;
    // console.log("user input ", event.results[length - 1][0].transcript);

    setText(newText);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ prompt: newText }),
        }
      );

      setIsListening(false);

      const responseData = await response.json();
      // console.log("responseData.data", responseData.data);
      setResponseData(responseData.data);
    } catch (error) {
      console.error("Error calling backend API:", error);
    }
  };

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = onResult;

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <SpeechRecognitionContext.Provider
      value={{
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
        isSpeaking,
        setIsSpeaking,
        setIsListening,
        responseData,
        setResponseData,
      }}
    >
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

export const useSpeechRecognitionContext = () => {
  return useContext(SpeechRecognitionContext);
};

export default SpeechRecognitionProvider;
