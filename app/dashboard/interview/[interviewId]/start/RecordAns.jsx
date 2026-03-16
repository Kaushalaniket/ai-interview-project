"use client";

import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";   
import { v4 as uuidv4 } from "uuid";            

export default function RecordAns({ questionObj, interviewData }) {
  const [isRecording, setIsRecording] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported. Use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((res) => res[0].transcript)
        .join(" ");
      setUserAnswer(text.trim());
    };

    recognition.onerror = () => {
      setIsRecording(false);
      recognition.stop();
    };
    recognition.onend = () => setIsRecording(false);

    setUserAnswer("");
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = async () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsRecording(false);
    toast.success("Answer Successfully Recorded ✔");

    if (!userAnswer || !questionObj || !interviewData) return;

    try {
      const feedbackPrompt =
        "Question:" +
        questionObj.question +
        ", User Answer:" +
        userAnswer +
        ", Depends on question and user answer please give us rating for answer and feedback as area of improvement " +
        "in just 3 to 5 lines. Return output ONLY in JSON format like " +
        `{ "rating": 8, "feedback": "short feedback here" }`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const raw = await result.response.text();

      const cleaned = raw.replace(/```json|```/g, "").trim();
      const jsonFeedback = JSON.parse(cleaned);

      console.log("Feedback from AI:", jsonFeedback);

      
      await db.insert(UserAnswer).values({
        mockIdRef: interviewData.mockId,
        question: questionObj.question,
        correctAns: questionObj.answer,
        userAns: userAnswer,
        feedback: jsonFeedback.feedback,
        rating: jsonFeedback.rating.toString(),
        userEmail: interviewData.userEmail,
        createdAt: new Date().toISOString(),
      });

      toast.success("Feedback saved to database ⭐");
    } catch (err) {
      console.error("Error saving feedback:", err);
      toast.error("Something went wrong, try again");
    }
  };

  const showAnswer = () => {
    if (userAnswer) alert(userAnswer);
    else alert("No answer recorded.");
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="bg-black rounded-xl flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
        <Webcam className="rounded-xl w-full h-full object-cover" />
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            🎙 Record Answer
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            ⏹ Stop Recording
          </button>
        )}

        <button
          onClick={showAnswer}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          👀 Show User Answer
        </button>
      </div>

      {userAnswer && (
        <p className="text-xs text-gray-700 text-center max-w-md">
          <b>Live Transcript:</b> {userAnswer}
        </p>
      )}
    </div>
  );
}
