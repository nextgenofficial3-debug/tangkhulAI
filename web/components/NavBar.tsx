"use client";
import { useState } from "react";
import { X } from "lucide-react";

const links = [
  { href: "/teach", label: "Teach" },
  { href: "/chat", label: "Chat" },
  { href: "/translate", label: "Translate" },
  { href: "/dataset", label: "Dataset" },
  { href: "/about", label: "About" },
  { href: "/contributors", label: "Contributors" },
  { href: "/evolution", label: "Evolution" },
];

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="border-b border-[#2d4a33] bg-[#0f1a12]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <a href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-[0.15em]">
                TANGKHUL <span className="text-[#c9a84c]">AI</span>
              </span>
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-[#a89f85] hover:text-[#f0ead8] transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 text-[#f0ead8] hover:text-[#c9a84c] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {open ? <X size={24} /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>}
            </button>
          </div>
        </div>
      </nav>
      {open && (
        <div className="md:hidden fixed inset-x-0 top-14 z-40 bg-[#0f1a12] border-b border-[#2d4a33] animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-[#a89f85] hover:text-[#f0ead8] hover:bg-[#1a2e1e] rounded-lg transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}