"use client";

import { useState, useEffect } from "react";

export default function TestPage() {
  const [status, setStatus] = useState("Loading...");
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setStatus("Speech recognition supported");
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        rec.onstart = () => {
          setStatus("Recording started");
          setIsRecording(true);
        };
        
        rec.onresult = (event: any) => {
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
          
          setTranscript(finalTranscript + interimTranscript);
        };
        
        rec.onerror = (event: any) => {
          setStatus(`Error: ${event.error}`);
          setIsRecording(false);
        };
        
        rec.onend = () => {
          setStatus("Recording ended");
          setIsRecording(false);
        };
        
        setRecognition(rec);
      } else {
        setStatus("Speech recognition not supported");
      }
    }
  }, []);

  const startRecording = async () => {
    if (!recognition) return;
    
    try {
      // Test microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("Microphone access granted, starting recording...");
      recognition.start();
    } catch (error) {
      setStatus(`Microphone access denied: ${error}`);
    }
  };

  const stopRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Speech Recognition Test</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Status: {status}</p>
        </div>
        
        <div className="mb-4">
          <button
            onClick={startRecording}
            disabled={!recognition || isRecording}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            Start Recording
          </button>
          
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="px-4 py-2 bg-red-500 text-white rounded ml-2 disabled:bg-gray-400"
          >
            Stop Recording
          </button>
        </div>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Transcript:</h3>
          <div className="bg-gray-50 p-3 rounded min-h-[100px]">
            {transcript || "No transcript yet..."}
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>Browser: {typeof window !== 'undefined' ? navigator.userAgent : 'Unknown'}</p>
          <p>HTTPS: {typeof window !== 'undefined' ? window.location.protocol === 'https:' : 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
} 