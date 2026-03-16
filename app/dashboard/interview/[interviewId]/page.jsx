"use client";

import React, { useEffect, use, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { WebcamIcon, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function InterviewPage(props) {
  // Next 16 me params Promise ho sakta hai, isliye use() se unwrap
  const { interviewId } = use(props.params);

  const router = useRouter();
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [interviewData, setInterviewData] = useState();
  const [deviceId, setDeviceId] = useState();   // ✅ yahi line change

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    setInterviewData(result[0]);
  };

  useEffect(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      const cam = devices.find((d) => d.kind === "videoinput");
      setDeviceId(cam?.deviceId);
    });
  }, []);

  useEffect(() => {
    GetInterviewDetails();
  }, [interviewId]);

  return (
    <div className="my-10 flex flex-col items-center">
      <h2 className="font-bold text-2xl mb-8">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start w-full max-w-5xl">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border bg-secondary p-5 space-y-3">
            {interviewData ? (
              <>
                <h2 className="text-lg">
                  <strong>Job Role/Job Position:</strong>{" "}
                  {interviewData.jobPosition}
                </h2>
                <h2 className="text-lg">
                  <strong>Job Description/Tech Stack:</strong>{" "}
                  {interviewData.jobDesc}
                </h2>
                <h2 className="text-lg">
                  <strong>Years of Experience:</strong>{" "}
                  {interviewData.jobExperience}
                </h2>
              </>
            ) : (
              <p className="text-gray-500">Loading interview details...</p>
            )}
          </div>

          <div className="rounded-xl border border-yellow-300 bg-yellow-100 p-5 text-sm leading-relaxed">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">
                Information
              </span>
            </div>
            <p>
              Enable Video Web Cam and Microphone to start your AI generated
              mock interview. It has 5 questions which you can answer and at the
              end you will get a report based on your answers.
            </p>
            <p className="mt-2">
              <span className="font-semibold">Note:</span> We never record your
              video. Web cam access is only for live interview and you can
              disable it any time if you want.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="bg-secondary rounded-xl border flex items-center justify-center w-[480px] h-[260px]">
            {webCamEnabled ? (
              <Webcam
                audio={true}
                videoConstraints={{
                  deviceId: deviceId,
                  width: 1280,
                  height: 720,
                  frameRate: 30,
                }}
                forceScreenshotSourceSize={true}
                className="rounded-xl w-full h-full object-cover"
              />
            ) : (
              <WebcamIcon className="h-24 w-24" />
            )}
          </div>

          <Button
            className="w-[480px]"
            onClick={() => setWebCamEnabled(true)}
            disabled={webCamEnabled}
          >
            Enable Web Cam and Microphone
          </Button>

          <Button
            className="mt-0.125 px-6 py-1 text-sm self-end w-[480px] bg-blue-600 hover:bg-blue-700 text-white"
            variant="outline"
            onClick={() =>
              router.push(`/dashboard/interview/${interviewId}/start`)
            }
          >
            Start
          </Button>
        </div>
      </div>
    </div>
  );
}
