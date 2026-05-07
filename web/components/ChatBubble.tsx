"use client";
import { useState } from "react";
import { TangkhulKeyboard } from "./TangkhulKeyboard";
import { useRef } from "react";

interface Props {
  message: string;
  isAi: boolean;
  onCorrect?: (corrected: string, note: string) => void;
}

export function ChatBubble({ message, isAi, onCorrect }: Props) {
  const [showCorrection, setShowCorrection] = useState(false);
  const [correctedText, setCorrectedText] = useState("");
  const [correctionNote, setCorrectionNote] = useState("");
  const correctionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!correctedText.trim()) return;
    onCorrect?.(correctedText, correctionNote);
    setShowCorrection(false);
    setCorrectedText("");
    setCorrectionNote("");
  };

  return (
    <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`max-w-[80%] ${isAi ? "order-1" : "order-2"}`}>
        <div
          className={`rounded-lg px-4 py-3 ${
            isAi
              ? "bg-[#1a2e1e] border border-[#2d4a33]"
              : "bg-[#1e3523] border border-[#c9a84c]/40"
          }`}
        >
          {isAi && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#2d4a33] flex items-center justify-center text-xs font-bold text-[#c9a84c]">
                Rā
              </div>
              <span className="text-xs text-[#c9a84c] font-medium">Rā</span>
            </div>
          )}
          <p className="text-[#f0ead8] text-sm whitespace-pre-wrap">{message}</p>
        </div>

        {isAi && onCorrect && (
          <div className="mt-1 ml-2">
            {!showCorrection ? (
              <button
                onClick={() => setShowCorrection(true)}
                className="text-xs text-[#a89f85] hover:text-[#c9a84c] transition-colors"
              >
                ✏ Correct this
              </button>
            ) : (
              <div className="mt-2 p-3 bg-[#1a2e1e] border border-[#2d4a33] rounded-lg animate-fade-in">
                <label className="text-xs text-[#a89f85] block mb-1">
                  Correct Tangkhul text
                </label>
                <textarea
                  ref={correctionRef}
                  value={correctedText}
                  onChange={(e) => setCorrectedText(e.target.value)}
                  className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded px-3 py-2 text-[#f0ead8] text-sm resize-none h-20"
                />
                <TangkhulKeyboard targetRef={correctionRef} onChange={setCorrectedText} />
                <label className="text-xs text-[#a89f85] block mt-2 mb-1">
                  Correction note (optional)
                </label>
                <input
                  value={correctionNote}
                  onChange={(e) => setCorrectionNote(e.target.value)}
                  placeholder="e.g. this is a more accurate form"
                  className="w-full bg-[#0f1a12] border border-[#2d4a33] rounded px-3 py-2 text-[#f0ead8] text-sm"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSubmit}
                    className="text-xs bg-[#c9a84c] text-[#0f1a12] px-3 py-1.5 rounded font-medium hover:bg-[#e8c97a] transition-colors"
                  >
                    Save Correction
                  </button>
                  <button
                    onClick={() => setShowCorrection(false)}
                    className="text-xs text-[#a89f85] hover:text-[#f0ead8] transition-colors px-3 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}