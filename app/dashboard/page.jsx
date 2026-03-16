"use client";

import React, { useEffect, useState } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

function Dashboard() {
  const { user } = useUser();
  const [interviews, setInterviews] = useState([]);

  const getData = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress));

    setInterviews(result || []);
  };

  useEffect(() => {
    getData();
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <div className="p-10">
      <h2 className="font-bold text-2xl">Dashboard</h2>
      <h2 className="text-gray-500">Create and Start your AI Mockup Interview</h2>

     
      <div className="grid grid-cols-1 md:grid-cols-3 my-5">
        <AddNewInterview />
      </div>

    
      <h3 className="text-xl font-semibold mt-8 mb-3">Previous Mock Interviews</h3>

      {interviews.length === 0 ? (
        <p className="text-gray-500">No mock interviews created yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {interviews.map((item) => (
            <div
              key={item.mockId}
              className="border rounded-xl p-5 shadow-sm bg-white flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">
                  {item.jobPosition || "Mock Interview"}
                </h3>
                <p className="text-sm text-gray-600">
                  {item.jobExperience} Years of Experience
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Created At: {item.createdAt || "—"}
                </p>
              </div>

              <div className="flex gap-3 mt-4 items-center">
                
                <Link
                  href={`/dashboard/interview/${item.mockId}/feedback`}
                  className="px-4 py-2 rounded-full border text-sm hover:bg-gray-100 transition"
                >
                  Feedback
                </Link>

               
                <Link
                  href={`/dashboard/interview/${item.mockId}/start`}
                  className="ml-auto px-5 py-2 rounded-full text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
