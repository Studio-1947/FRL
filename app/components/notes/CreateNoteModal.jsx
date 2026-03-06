"use client";

import { useState, useRef, useEffect } from "react";
import { fetchApi } from "../../../lib/api";
import { X, Mic, StopCircle, FileText, Loader2 } from "lucide-react";

export default function CreateNoteModal({
  onClose,
  onSuccess,
  noteToEdit = null,
}) {
  const isEditing = !!noteToEdit;
  const [mode, setMode] = useState(noteToEdit?.isVoiceNote ? "voice" : "text");
  const [title, setTitle] = useState(noteToEdit?.title || "");
  const [content, setContent] = useState(noteToEdit?.content || "");

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(noteToEdit?.audioUrl || null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState(
    noteToEdit?.transcription || "",
  );
  const [recordingTime, setRecordingTime] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef(
    noteToEdit?.transcription ? noteToEdit.transcription + " " : "",
  );

  useEffect(() => {
    // Setup Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscriptRef.current += transcript + " ";
            } else {
              interimTranscript += transcript;
            }
          }
          setTranscription(
            (finalTranscriptRef.current + interimTranscript).trim(),
          );
        };
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      if (recognitionRef.current) {
        setTranscription("");
        finalTranscriptRef.current = "";
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
      setError(
        "Microphone access denied or not available. Please allow permissions in your browser.",
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    const endpoint = isEditing ? `/v1/notes/${noteToEdit.id}` : "/v1/notes";
    const method = isEditing ? "PATCH" : "POST";

    try {
      if (mode === "text") {
        if (!content.trim()) {
          setError("Note content is required.");
          setIsSubmitting(false);
          return;
        }

        const response = await fetchApi(endpoint, {
          method,
          body: JSON.stringify({ title, content, isVoiceNote: false }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "Failed to save text note");
        }
      } else {
        if (!audioBlob && !isEditing) {
          setError("Please record an audio note first.");
          setIsSubmitting(false);
          return;
        }

        if (audioBlob) {
          // If a new audio is recorded, we must use FormData
          const formData = new FormData();
          formData.append("file", audioBlob, "voice-note.webm");
          formData.append("title", title);
          formData.append("transcription", transcription);
          formData.append("isVoiceNote", "true");

          // Note: Voice updates technically should use a different endpoint or handle it in service
          // but for simplicity, if we have a file, and its PATCH, we might need a dedicated voice update endpoint
          // However, our backend POST /voice handles blob upload.
          // Let's check if PATCH handles files. Backend Patch only takes JSON.

          if (isEditing) {
            // For editing voice notes with NEW audio, we'll use the voice creation logic
            // but we need to delete the old one or just use a dedicated update-voice endpoint.
            // Simplified: We'll call the voice creation logic and then delete the old one manually or
            // just implement a proper PATCH for voice in backend.
            // ACTUALLY, let's just use the same create endpoint for new voice or refine PATCH.

            // To keep it simple for the user, I'll alert that editing audio isn't supported yet, OR
            // I'll implement a workaround. Let's assume they mostly want to edit Title/Transcription.

            const voiceResponse = await fetchApi(`/v1/notes/voice`, {
              method: "POST", // Create new
              body: formData,
            });
            if (voiceResponse.ok) {
              await fetchApi(`/v1/notes/${noteToEdit.id}`, {
                method: "DELETE",
              });
            } else {
              const errorData = await voiceResponse.json();
              throw new Error(
                errorData?.message || "Failed to update voice note",
              );
            }
          } else {
            const response = await fetchApi("/v1/notes/voice", {
              method: "POST",
              body: formData,
            });
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData?.message || "Failed to upload voice note",
              );
            }
          }
        } else {
          // Just updating Title/Transcription for an existing voice note
          const response = await fetchApi(endpoint, {
            method,
            body: JSON.stringify({ title, transcription }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Failed to update metadata");
          }
        }
      }

      onSuccess();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save note. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-[#111] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Note
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-[#1f1f1f] justify-center rounded-xl mb-6">
            <button
              onClick={() => setMode("text")}
              className={`flex-1 flex gap-2 items-center justify-center py-2 rounded-lg font-medium text-sm transition-all ${mode === "text" ? "bg-white dark:bg-[#333] shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"}`}
            >
              <FileText size={16} /> Text
            </button>
            <button
              onClick={() => setMode("voice")}
              className={`flex-1 flex gap-2 items-center justify-center py-2 rounded-lg font-medium text-sm transition-all ${mode === "voice" ? "bg-white dark:bg-[#333] shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"}`}
            >
              <Mic size={16} /> Voice Record
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a title..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>

            {mode === "text" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent outline-none transition-all text-gray-900 dark:text-white resize-none"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-[rgba(255,255,255,0.02)] transition-colors">
                {audioUrl ? (
                  <div className="w-full flex flex-col items-center gap-6 animate-in fade-in">
                    <audio
                      src={audioUrl}
                      controls
                      className="w-full max-w-sm rounded-[30px]"
                    />

                    {transcription && (
                      <div className="w-full text-left">
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider">
                          Transcription Preview
                        </label>
                        <div className="p-4 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800 rounded-xl max-h-40 overflow-y-auto shadow-sm">
                          <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
                            "{transcription}"
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setAudioUrl(null);
                        setAudioBlob(null);
                        setTranscription("");
                        finalTranscriptRef.current = "";
                      }}
                      className="text-sm border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      Delete & Record Again
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-5">
                    <button
                      className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? "bg-red-50 text-red-500 ring-4 ring-red-100 animate-pulse scale-105" : "bg-white border border-gray-200 dark:bg-[#1a1a1a] dark:border-gray-800 text-gray-800 dark:text-gray-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer shadow-sm hover:shadow-xl hover:scale-105"}`}
                      onClick={
                        isRecording ? handleStopRecording : handleStartRecording
                      }
                    >
                      {isRecording ? (
                        <StopCircle size={40} />
                      ) : (
                        <Mic size={40} strokeWidth={2} />
                      )}
                    </button>
                    <div className="text-center">
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {isRecording ? "Recording..." : "Tap to record"}
                      </p>
                      {isRecording && (
                        <p className="text-red-500 tabular-nums font-mono font-bold mt-1 text-xl tracking-wider">
                          {formatTime(recordingTime)}
                        </p>
                      )}
                      {!isRecording && !audioUrl && (
                        <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
                          Ensure your browser has mic permissions.
                        </p>
                      )}
                    </div>

                    {isRecording && transcription && (
                      <div className="w-full mt-4 text-left animate-in fade-in slide-in-from-top-2 duration-300">
                        <label className="block text-[10px] font-bold uppercase text-red-500 mb-1 tracking-widest flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                          Live Transcription
                        </label>
                        <div className="p-3 bg-white dark:bg-[#1a1a1a] border border-red-100 dark:border-red-900/30 rounded-xl max-h-32 overflow-y-auto shadow-sm">
                          <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                            "{transcription}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50 dark:bg-[#141414]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-semibold text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              (mode === "text" && !content.trim()) ||
              (mode === "voice" && !audioBlob)
            }
            className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            {isSubmitting ? "Saving..." : "Save Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
