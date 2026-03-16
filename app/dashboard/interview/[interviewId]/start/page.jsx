"use client";

import React, { useEffect, useState, use } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import RecordAns from "./RecordAns";

export default function StartInterview(props) {
  const { interviewId } = use(props.params);

  const [mockQuestions, setMockQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [interviewData, setInterviewData] = useState(null);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (!result || result.length === 0) return;

    const row = result[0];
    const json = row.jsonMockResp ? JSON.parse(row.jsonMockResp) : [];

    setMockQuestions(json);
    setInterviewData(row);
  };

  useEffect(() => {
    GetInterviewDetails();
  }, [interviewId]);

  const currentQuestionObj = mockQuestions[activeQuestion];

  
  const handleEndInterview = () => {
    window.location.href = "/dashboard/interview/" + interviewId + "/feedback";
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
      
      
      <div className="h-full">
        <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 h-full flex flex-col">
          
          
          <div className="flex gap-3 mb-6 flex-wrap">
            {mockQuestions?.map((q, index) => (
              <button
                key={index}
                onClick={() => setActiveQuestion(index)}
                className={`px-5 py-2 rounded-full border text-sm font-medium transition ${
                  activeQuestion === index
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
              >
                Question #{index + 1}
              </button>
            ))}
          </div>

         
          <h2 className="text-base md:text-lg font-medium leading-relaxed text-gray-900 mb-6">
            {currentQuestionObj?.question}
          </h2>

          
          <div className="flex justify-between mt-4 mb-4">
           
            <button
              disabled={activeQuestion === 0}
              onClick={() => setActiveQuestion((prev) => prev - 1)}
              className="px-5 py-2 rounded-full text-sm font-medium border bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
            >
              ⬅ Previous
            </button>

            
            {activeQuestion === mockQuestions.length - 1 ? (
              <button
                onClick={handleEndInterview}
                className="px-5 py-2 rounded-full text-sm font-medium border bg-green-600 text-white hover:bg-green-700"
              >
                ✔ End Interview
              </button>
            ) : (
              <button
                onClick={() => setActiveQuestion((prev) => prev + 1)}
                className="px-5 py-2 rounded-full text-sm font-medium border bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Next ➡
              </button>
            )}
          </div>

         
          <div className="rounded-xl border border-blue-300 bg-blue-50 px-5 py-4 text-sm mt-auto">
            <h3 className="font-semibold text-blue-700 mb-1">📌 Note:</h3>
            <p>
              Click on <strong>Record Answer</strong> when answering.  
              Feedback & rating will be generated automatically when you stop recording.
            </p>
          </div>
        </div>
      </div>

      
      <div className="h-full flex justify-center md:justify-end">
        <div className="rounded-2xl border bg-white shadow-sm p-6 md:p-8 h-full w-full flex flex-col items-center">
          <RecordAns
            questionObj={currentQuestionObj}
            interviewData={interviewData}
          />
        </div>
      </div>
    </div>
  );
}
