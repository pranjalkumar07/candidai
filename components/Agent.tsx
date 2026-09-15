"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  PhoneOff,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface ExtendedAgentProps extends AgentProps {
  role?: string;
  interviewMode?: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions = [],
  role = "Software Engineer",
  interviewMode = "Technical",
}: ExtendedAgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const feedbackSubmittedRef = useRef(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Timer effect during active call
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callStatus === CallStatus.ACTIVE) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else if (callStatus === CallStatus.INACTIVE) {
      setElapsedSeconds(0);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Vapi event listeners
  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setIsMuted(false);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);

        if (message.role === "assistant" && questions && questions.length > 1) {
          setCurrentQuestionIndex((prev) =>
            Math.min(prev + 1, questions.length - 1)
          );
        }
      }
    };

    const onSpeechStart = () => {
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const onError = (error: unknown) => {
      console.error("Vapi error:", error);
      setCallStatus(CallStatus.INACTIVE);
      setIsSpeaking(false);
      const vapiErr = error as { message?: string };
      const errorMessage =
        vapiErr?.message ||
        (typeof error === "string"
          ? error
          : "Voice call error occurred. Please try again.");
      toast.error(errorMessage);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [questions]);

  // Trigger feedback upon call completion
  useEffect(() => {
    if (callStatus !== CallStatus.FINISHED) return;

    if (type === "generate") {
      router.push("/");
      router.refresh();
      return;
    }

    if (type === "interview") {
      if (feedbackSubmittedRef.current) return;
      feedbackSubmittedRef.current = true;

      const triggerFeedback = async () => {
        if (!messages || messages.length === 0) {
          toast.error("No conversation was recorded to generate evaluation.");
          feedbackSubmittedRef.current = false;
          return;
        }

        setIsSubmittingFeedback(true);
        try {
          const result = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages,
            feedbackId,
          });

          if (result?.success && result?.feedbackId) {
            toast.success("Interview completed. Feedback evaluation ready.");
            router.push(`/interview/${interviewId}/feedback`);
          } else {
            toast.error(
              "Failed to save evaluation. Please retake the session."
            );
            setIsSubmittingFeedback(false);
            feedbackSubmittedRef.current = false;
          }
        } catch (error: unknown) {
          console.error("Error generating feedback:", error);
          const errObj = error as { message?: string };
          toast.error(
            errObj?.message || "An error occurred while evaluating session."
          );
          setIsSubmittingFeedback(false);
          feedbackSubmittedRef.current = false;
        }
      };

      triggerFeedback();
    }
  }, [callStatus, feedbackId, interviewId, messages, router, type, userId]);

  const handleCall = async () => {
    const webToken = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;
    if (!webToken) {
      toast.error(
        "Vapi Web Token is missing. Please check NEXT_PUBLIC_VAPI_WEB_TOKEN."
      );
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
        if (!workflowId) {
          toast.error(
            "Vapi Workflow ID is missing. Please set NEXT_PUBLIC_VAPI_WORKFLOW_ID."
          );
          setCallStatus(CallStatus.INACTIVE);
          return;
        }

        await vapi.start(workflowId, {
          variableValues: {
            username: userName,
            userid: userId,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      }
    } catch (err: unknown) {
      console.error("Failed to start Vapi call:", err);
      setCallStatus(CallStatus.INACTIVE);
      const callErr = err as { message?: string };
      toast.error(
        callErr?.message ||
          "Failed to start voice call. Please check microphone permissions."
      );
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const toggleMute = () => {
    try {
      const nextMute = !isMuted;
      vapi.setMuted(nextMute);
      setIsMuted(nextMute);
    } catch (e) {
      console.error("Mute toggle failed:", e);
    }
  };

  const nextQuestion = () => {
    if (questions && questions.length > 0) {
      setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const totalQuestions = questions?.length || 5;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      {/* Top Session Bar */}
      <div className="surface-glass px-5 py-3.5 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-[#845CFF] uppercase tracking-wider block">
            {interviewMode} Interview
          </span>
          <span className="text-xs text-[#69748D] font-medium">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Voice Status Indicator with Audio Waveform */}
        <div>
          {isSpeaking ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#6D4AFF]/15 border border-[#6D4AFF]/30 text-xs font-medium shadow-[0_0_12px_rgba(109,74,255,0.2)]">
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#845CFF] rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-2 bg-[#845CFF] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.1s]" />
                <span className="w-0.5 h-3.5 bg-[#845CFF] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s]" />
                <span className="w-0.5 h-2 bg-[#845CFF] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s]" />
              </div>
              <span className="text-[#845CFF] font-semibold text-[11px]">Speaking</span>
            </div>
          ) : callStatus === CallStatus.ACTIVE ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 text-xs font-medium shadow-[0_0_12px_rgba(34,197,94,0.15)]">
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-[#22C55E] rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                <span className="w-0.5 h-3 bg-[#22C55E] rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.15s]" />
                <span className="w-0.5 h-2.5 bg-[#22C55E] rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.25s]" />
              </div>
              <span className="text-[#22C55E] font-semibold text-[11px]">Listening</span>
            </div>
          ) : callStatus === CallStatus.CONNECTING ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5B942]/10 border border-[#F5B942]/30 text-xs font-medium shadow-[0_0_12px_rgba(245,185,66,0.15)]">
              <span className="size-2 rounded-full bg-[#F5B942] animate-pulse" />
              <span className="text-[#F5B942] text-[11px] font-semibold">Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-xs font-medium">
              <span className="size-2 rounded-full bg-[#69748D]" />
              <span className="text-[#69748D] text-[11px]">Ready</span>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#F5F7FF] bg-[#0B1224] px-3 py-1.5 rounded-lg border border-[rgba(110,120,180,0.22)]">
          <Clock className="size-3.5 text-[#845CFF]" />
          <span>{formatTime(elapsedSeconds)}</span>
        </div>
      </div>

      {/* Center Question Theater */}
      <div className="surface-glass relative overflow-hidden p-8 sm:p-12 flex flex-col items-center text-center justify-between min-h-[320px]">
        {/* Subtle glowing halo behind question theater */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(109, 74, 255, 0.16) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 w-full flex justify-between items-center text-xs text-[#69748D] pb-4 border-b border-[rgba(110,120,180,0.15)]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#845CFF]">
            Current Question
          </span>
          <span className="text-[#8F9BB3] font-medium">{role}</span>
        </div>

        {/* Question Text */}
        <div className="relative z-10 my-8 max-w-2xl">
          <p className="text-lg sm:text-2xl font-bold text-[#F5F7FF] leading-relaxed tracking-tight">
            {questions && questions.length > 0
              ? `"${questions[currentQuestionIndex]}"`
              : `"Could you walk me through your background, technical focus areas, and experience?"`}
          </p>
        </div>

        {/* Voice Status Note */}
        <div className="relative z-10 w-full flex items-center justify-center gap-2 text-xs text-[#69748D] pt-4 border-t border-[rgba(110,120,180,0.15)]">
          {callStatus === CallStatus.ACTIVE ? (
            <span className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${isSpeaking ? "bg-[#845CFF] animate-ping" : "bg-[#22C55E]"}`} />
              {isSpeaking
                ? "Interviewer is asking the question. Listen carefully."
                : "Microphone active. Speak your answer clearly."}
            </span>
          ) : (
            <span>Click &quot;Start interview&quot; below to begin voice session</span>
          )}
        </div>
      </div>

      {/* Bottom Controls Dock */}
      <div className="surface-glass p-3.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Transcript Toggle */}
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="inline-flex items-center justify-center sm:justify-start gap-1.5 text-xs font-medium text-[#8F9BB3] hover:text-[#F5F7FF] transition-colors cursor-pointer py-1"
        >
          <MessageSquare className="size-3.5 text-[#845CFF]" />
          <span>{showTranscript ? "Hide transcript" : "Show transcript"}</span>
          {showTranscript ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
        </button>

        {/* Center/Right: Action Buttons */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3">
          {isSubmittingFeedback ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-[#845CFF] px-4 py-2 rounded-lg bg-[#0B1224] border border-[#6D4AFF]/30 shadow-[0_0_12px_rgba(109,74,255,0.2)] w-full sm:w-auto justify-center">
              <Loader2 className="size-3.5 animate-spin text-[#845CFF]" />
              <span>Saving evaluation...</span>
            </div>
          ) : callStatus !== CallStatus.ACTIVE ? (
            <button
              type="button"
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className="inline-flex items-center justify-center gap-2 h-10 px-6 text-xs font-semibold text-white bg-gradient-to-r from-[#6D4AFF] to-[#4F46E5] hover:from-[#7B5BFF] hover:to-[#5B54F0] rounded-lg shadow-[0_4px_20px_rgba(109,74,255,0.35)] hover:shadow-[0_4px_28px_rgba(109,74,255,0.5)] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <Mic className="size-4" />
              <span>
                {callStatus === CallStatus.CONNECTING
                  ? "Connecting..."
                  : callStatus === CallStatus.FINISHED
                  ? "Retake session"
                  : "Start interview"}
              </span>
            </button>
          ) : (
            <>
              {/* Mute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                className={cn(
                  "size-9 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0",
                  isMuted
                    ? "bg-[#F5B942]/15 border-[#F5B942]/30 text-[#F5B942] shadow-[0_0_12px_rgba(245,185,66,0.2)]"
                    : "bg-[#0B1224] border-[rgba(110,120,180,0.22)] text-[#8F9BB3] hover:text-[#F5F7FF] hover:border-[rgba(110,120,180,0.4)]"
                )}
                title={isMuted ? "Unmute mic" : "Mute mic"}
              >
                {isMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
              </button>

              {/* Next Question Button */}
              <button
                type="button"
                onClick={nextQuestion}
                disabled={currentQuestionIndex >= totalQuestions - 1}
                className="btn-secondary h-9 px-3 text-xs rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <span>Next question</span>
                <ChevronRight className="size-3.5" />
              </button>

              {/* End Interview Button */}
              <button
                type="button"
                onClick={handleDisconnect}
                className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 sm:px-4 text-xs font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors cursor-pointer shadow-[0_2px_12px_rgba(239,68,68,0.3)] flex-1 sm:flex-none"
              >
                <PhoneOff className="size-3.5" />
                <span>End interview</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable Live Transcript Panel */}
      {showTranscript && (
        <div className="surface-glass p-5 flex flex-col gap-3 max-h-[360px] shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(110,120,180,0.15)]">
            <span className="text-xs font-semibold text-[#F5F7FF]">Live Transcript</span>
            <span className="text-[11px] text-[#69748D]">{messages.length} messages</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[260px]">
            {messages.length === 0 ? (
              <p className="text-xs text-[#69748D] text-center py-6">
                No speech recorded yet. Speak into your microphone to view transcription.
              </p>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-3 rounded-lg text-xs leading-relaxed max-w-[85%]",
                    msg.role === "user"
                      ? "ml-auto bg-[#0B1224] border border-[rgba(110,120,180,0.22)] text-[#F5F7FF]"
                      : "mr-auto bg-[#6D4AFF]/10 border border-[#6D4AFF]/25 text-[#CBD5E1]"
                  )}
                >
                  <span className="text-[10px] font-bold block mb-1 opacity-80 uppercase tracking-wider text-[#845CFF]">
                    {msg.role === "user" ? userName || "You" : "CandidAI Interviewer"}
                  </span>
                  <span>{msg.content}</span>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
