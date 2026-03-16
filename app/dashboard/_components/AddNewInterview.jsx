"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "@/utils/db";
import { useRouter } from "next/navigation";

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!user?.primaryEmailAddress?.emailAddress) {
      alert("Please login first.");
      return;
    }

    setLoading(true);

    console.log("Form Data:", jobPosition, jobExperience, jobDesc);

    const InputPrompt = `
Job Position: ${jobPosition},
Job Description: ${jobDesc},
Years of Experience: ${jobExperience}.
Based on this information, give me ${
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5
    } interview questions with answers.

Return ONLY a valid JSON array.
No explanation, no extra text, no markdown, no backticks.
Each item must have "question" and "answer" fields.
`;

    try {
    
      const result = await chatSession.sendMessage(InputPrompt);

      const rawText = result.response.text().replace(/```json|```/g, "").trim();

      console.log("RAW_TEXT_FROM_GEMINI =>", rawText);

      const start = rawText.indexOf("[");
      const end = rawText.lastIndexOf("]");

      if (start === -1 || end === -1) {
        console.error("Not valid JSON response:", rawText);
        alert("AI ne proper JSON nahi diya, thoda baad me try karo.");
        return;
      }

      const jsonStr = rawText.slice(start, end + 1);
      const data = JSON.parse(jsonStr);

      console.log("Parsed JSON =>", data);

      const MockJsonResp = jsonStr;
      setJsonResponse(MockJsonResp);

     
      if (MockJsonResp) {
        const insertResult = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: MockJsonResp,
            jobPosition: jobPosition,
            jobDesc: jobDesc,
            jobExperience: jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format("DD-MM-YYYY"),
          })
          .returning({ mockId: MockInterview.mockId });

        console.log("Inserted row:", insertResult);

        const mockId = insertResult[0]?.mockId;

        if (!mockId) {
          console.error("Mock ID not found in DB insert response");
          alert("Kuch galat ho gaya, mock interview ID nahi mili.");
          return;
        }

        
        setOpenDialog(false);
        router.push("/dashboard/interview/" + mockId);
      } else {
        console.error("MockJsonResp empty hai");
        alert("AI response sahi nahi aya, dobara try karo.");
      }
    } catch (err) {
      console.error("Error while calling Gemini or DB insert:", err);
      alert("Kuch error aa gaya, thodi der baad fir try karo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="font-bold text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              Add details about job position, your skills and years of
              experience.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Job Role / Job Position
              </label>
              <Input
                placeholder="Ex. Full Stack Developer"
                required
                onChange={(event) => setJobPosition(event.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Job Description / Tech Stack (In short)
              </label>
              <Textarea
                placeholder="Ex. React, Angular, NodeJs etc"
                required
                onChange={(event) => setJobDesc(event.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Years of Experience
              </label>
              <Input
                placeholder="Ex. 5"
                type="number"
                min={0}
                required
                onChange={(event) => setJobExperience(event.target.value)}
              />
            </div>

            <div className="flex gap-5 justify-end pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin w-4 h-4" />
                    Generating from AI...
                  </span>
                ) : (
                  "Start Interview"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
