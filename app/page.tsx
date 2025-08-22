"use client";

import { useState, useEffect, useRef } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface TranscriptEntry {
  id: string;
  original: string;
  translated: string;
  timestamp: Date;
}

export default function Home() {
  // State variables
  const [inputLang, setInputLang] = useState("en-US");
  const [outputLang, setOutputLang] = useState("es");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);

  // Simple ref for speech recognition
  const recognitionRef = useRef<any>(null);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);

  // Language options
  const languages = [
    { code: "en-US", name: "English (US)" },
    { code: "es-ES", name: "Spanish" },
    { code: "fr-FR", name: "French" },
    { code: "de-DE", name: "German" },
    { code: "it-IT", name: "Italian" },
    { code: "pt-BR", name: "Portuguese (Brazil)" },
    { code: "ru-RU", name: "Russian" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "ja-JP", name: "Japanese" },
    { code: "ko-KR", name: "Korean" },
    { code: "ar-SA", name: "Arabic" },
    { code: "hi-IN", name: "Hindi" },
  ];

  const outputLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
  ];

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis;
    }
  }, []);

  // Simple start recording function
  const startRecording = async () => {
    try {
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setError("Speech recognition not supported in this browser");
        return;
      }

      // Check microphone permissions
      await navigator.mediaDevices.getUserMedia({ audio: true });

             // Create new recognition instance
       const recognition = new SpeechRecognition();
       recognition.continuous = true; // Keep it running longer
       recognition.interimResults = true;
       recognition.lang = inputLang;
       recognition.maxAlternatives = 1;

      // Set up event handlers
      recognition.onstart = () => {
        setIsRecording(true);
        setError("");
        setCurrentTranscript("");
      };

             recognition.onresult = (event: any) => {
         let finalTranscript = '';
         let interimTranscript = '';

         for (let i = event.resultIndex; i < event.results.length; i++) {
           const transcript = event.results[i][0].transcript;
           if (event.results[i].isFinal) {
             finalTranscript += transcript;
           } else {
             interimTranscript += transcript;
           }
         }

         // Accumulate the transcript instead of replacing it
         setCurrentTranscript(prev => {
           // Remove any interim text from the previous state
           const prevFinal = prev.replace(/\[interim\].*$/, '');
           return prevFinal + finalTranscript;
         });
       };

      recognition.onerror = (event: any) => {
        if (event.error !== 'aborted') {
          setError(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      // Store reference and start
      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      setError("Failed to start recording. Please check microphone permissions.");
      setIsRecording(false);
    }
  };

  // Simple stop recording function
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Translate text
  const handleTranslate = async (text: string) => {
    if (!text.trim()) return;
    
    setIsTranslating(true);
    try {
      const res = await fetch("/api/Translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          inputText: text, 
          inputLang: inputLang.split('-')[0], 
          outputLang 
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 429) {
          setError("OpenAI quota exceeded. Please add credits to your account.");
        } else {
          setError(`Translation error: ${data.error || "Unknown error"}`);
        }
        return;
      }
      
      const newTranscript: TranscriptEntry = {
        id: Date.now().toString(),
        original: text,
        translated: data.translated,
        timestamp: new Date(),
      };
      
      setTranscripts(prev => [newTranscript, ...prev]);
      setCurrentTranscript("");
    } catch (error) {
      setError("Translation failed. Please check your connection.");
    } finally {
      setIsTranslating(false);
    }
  };

  // Speak translated text
  const speakText = (text: string, lang: string) => {
    if (!speechSynthesisRef.current) {
      setError("Speech synthesis not supported");
      return;
    }

    speechSynthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Speech playback failed");
    };

    speechSynthesisRef.current.speak(utterance);
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Healthcare Translation Assistant
          </h1>
          <p className="text-gray-600">
            Real-time voice translation for healthcare communication
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Language (Voice)
              </label>
              <select
                value={inputLang}
                onChange={(e) => setInputLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRecording}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Language (Translation)
              </label>
              <select
                value={outputLang}
                onChange={(e) => setOutputLang(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isRecording}
              >
                {outputLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Input Mode Toggle */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-4">
              <button
                onClick={() => setUseManualInput(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  !useManualInput
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Voice Input
              </button>
              <button
                onClick={() => setUseManualInput(true)}
                className={`px-4 py-2 rounded-lg transition ${
                  useManualInput
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Manual Input
              </button>
            </div>

            {!useManualInput ? (
              // Voice Recording
              <div>
                <button
                  onClick={toggleRecording}
                  className={`px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isRecording ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                      Stop Recording
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      Start Recording
                    </div>
                  )}
                </button>
                
                {isRecording && (
                  <p className="text-sm text-gray-600 mt-2">
                    Speak now... Your voice will be transcribed in real-time
                  </p>
                )}
              </div>
            ) : (
              // Manual Text Input
              <div className="w-full max-w-lg mx-auto">
                <textarea
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your text here..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  rows={4}
                />
                <div className="mt-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleTranslate(manualInput)}
                    disabled={isTranslating || !manualInput.trim()}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                  >
                    {isTranslating ? "Translating..." : "Translate"}
                  </button>
                  <button
                    onClick={() => setManualInput("")}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Transcript */}
        {currentTranscript && !useManualInput && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Current Transcript
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{currentTranscript}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleTranslate(currentTranscript)}
                disabled={isTranslating}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400"
              >
                {isTranslating ? "Translating..." : "Translate"}
              </button>
              <button
                onClick={() => setCurrentTranscript("")}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError("")}
              className="text-red-500 text-sm mt-2 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Translation History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Translation History
          </h3>
          {transcripts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No translations yet. Start recording to see translations here.
            </p>
          ) : (
            <div className="space-y-4">
              {transcripts.map((transcript) => (
                <div
                  key={transcript.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Original</h4>
                      <p className="text-gray-600">{transcript.original}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Translation</h4>
                      <p className="text-gray-600">{transcript.translated}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => speakText(transcript.translated, outputLang)}
                          disabled={isSpeaking}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                          {isSpeaking ? "Speaking..." : "Speak"}
                        </button>
                        <button
                          onClick={stopSpeaking}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Stop
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {transcript.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Healthcare Translation Assistant - Built with Next.js and OpenAI</p>
          <p className="mt-1">
            Note: This app uses speech recognition and AI translation. 
            Please ensure patient privacy and HIPAA compliance in clinical settings.
          </p>
        </div>
      </div>
    </main>
  );
}