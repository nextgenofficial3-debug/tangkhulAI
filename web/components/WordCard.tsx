import { Eye } from "lucide-react";
import type { Word } from "@/lib/supabase";

interface Props {
  word: Word;
}

export function WordCard({ word }: Props) {
  return (
    <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="tangkhul-text text-[#c9a84c] text-xl font-semibold leading-tight break-words">
            {word.tangkhul_word}
          </h3>
          {word.phonetic && (
            <p className="text-[#a89f85] text-sm mt-0.5">[{word.phonetic}]</p>
          )}
        </div>
        {word.part_of_speech && (
          <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-[#2d4a33] text-[#e8c97a] font-medium whitespace-nowrap">
            {word.part_of_speech}
          </span>
        )}
      </div>

      <p className="text-[#f0ead8] text-base">{word.english_word}</p>

      {word.category && (
        <span className="text-xs text-[#a89f85] bg-[#1a2e1e] px-2 py-1 rounded self-start">
          {word.category}
        </span>
      )}

      {word.example_tangkhul && (
        <div className="border-t border-[#2d4a33] pt-2 mt-1">
          <p className="text-sm text-[#e8c97a] italic">{word.example_tangkhul}</p>
          {word.example_english && (
            <p className="text-xs text-[#a89f85] mt-1">{word.example_english}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[#a89f85] mt-auto pt-2 border-t border-[#2d4a33]">
        <span>by {word.contributor_name}</span>
        <span className="flex items-center gap-1">
          <Eye size={14} /> {word.view_count}
        </span>
      </div>
    </div>
  );
}