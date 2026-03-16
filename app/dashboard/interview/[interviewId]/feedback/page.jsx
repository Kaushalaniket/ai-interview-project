"use client";

import { use, useEffect, useState } from "react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link"; // 👈 NEW

export default function FeedbackPage(props) {
  const { interviewId } = use(props.params);

  const [feedbackData, setFeedbackData] = useState([]);

  const GetFeedbackData = async () => {
    if (!interviewId) return;

    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(eq(UserAnswer.mockIdRef, interviewId));

      setFeedbackData(result);
    } catch (err) {
      console.error("Error loading feedback:", err);
    }
  };

  useEffect(() => {
    GetFeedbackData();
  }, []);

  const overallRating =
    feedbackData && feedbackData.length > 0
      ? (
          feedbackData.reduce(
            (sum, item) => sum + (Number(item.rating) || 0),
            0
          ) / feedbackData.length
        ).toFixed(1)
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 my-10">
      <h1 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
        🎉 Congratulations!
      </h1>
      <h2 className="text-xl md:text-2xl font-medium mb-4">
        Here is your interview feedback
      </h2>

      <p className="text-lg font-semibold text-indigo-600 mb-6">
        Your overall interview rating:{" "}
        <span className="font-bold text-blue-700">
          {overallRating ? `${overallRating}/10` : "N/A"}
        </span>
      </p>

      <p className="text-gray-700 mb-10">
        Find below interview question with correct answer, your answer and
        feedback for improvement
      </p>

      {feedbackData?.map((item, index) => (
        <div
          key={item.id}
          className="rounded-xl border mb-8 shadow-sm bg-white overflow-hidden"
        >
          <summary className="cursor-pointer text-lg font-medium bg-gray-100 px-6 py-4">
            {index + 1}. {item.question}
          </summary>

          <p className="text-lg font-bold text-red-600 px-6 pt-4">
            Rating: {item.rating}
          </p>

          <div className="px-6 py-4 mt-3 bg-red-50 border-t border-red-300">
            <p className="text-sm font-bold mb-1 text-red-700">Your Answer:</p>
            <p className="text-gray-700 leading-relaxed">{item.userAns}</p>
          </div>

          <div className="px-6 py-4 bg-green-50 border-t border-green-300">
            <p className="text-sm font-bold mb-1 text-green-700">
              Correct Answer:
            </p>
            <p className="text-gray-700 leading-relaxed">{item.correctAns}</p>
          </div>

          <div className="px-6 py-4 bg-blue-50 border-t border-blue-300">
            <p className="text-sm font-bold mb-1 text-blue-700">Feedback:</p>
            <p className="text-gray-700 leading-relaxed">{item.feedback}</p>
          </div>
        </div>
      ))}
      <div className="flex justify-center mt-10 mb-20">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition shadow"
        >
          ⬅ Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
