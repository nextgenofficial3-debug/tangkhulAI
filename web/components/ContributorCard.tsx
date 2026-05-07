import { Calendar } from "lucide-react";
import type { Contributor } from "@/lib/supabase";

interface Props {
  contributor: Contributor;
}

export function ContributorCard({ contributor }: Props) {
  const date = new Date(contributor.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-[#1e3523] border border-[#2d4a33] rounded-lg p-5 flex flex-col gap-3 animate-fade-in">
      <div className="flex items-start justify-between">
        <h3 className="text-[#f0ead8] font-semibold text-lg">{contributor.name}</h3>
        <span className="text-xs text-[#a89f85] flex items-center gap-1 shrink-0">
          <Calendar size={12} /> {date}
        </span>
      </div>
      {contributor.region && (
        <p className="text-sm text-[#a89f85]">{contributor.region}</p>
      )}
      {contributor.message && (
        <div className="border-t border-[#2d4a33] pt-3 mt-1">
          <p className="text-sm text-[#e8c97a] italic leading-relaxed">
            &ldquo;{contributor.message}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}