"use client";
import { useRef } from "react";

const CHARS = [
  { label: "A", char: "A", row: 0 },
  { label: "Ā", char: "Ā", row: 0 },
  { label: "A̲", char: "A̲", row: 0 },
  { label: "a", char: "a", row: 1 },
  { label: "ā", char: "ā", row: 1 },
  { label: "a̲", char: "a̲", row: 1 },
];

interface Props {
  targetRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onChange?: (value: string) => void;
}

export function TangkhulKeyboard({ targetRef, onChange }: Props) {
  const insertChar = (char: string) => {
    const el = targetRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newValue = el.value.slice(0, start) + char + el.value.slice(end);

    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    nativeInputValueSetter?.call(el, newValue);
    el.dispatchEvent(new Event("input", { bubbles: true }));

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + char.length, start + char.length);
    });
    onChange?.(newValue);
  };

  const row0 = CHARS.filter((c) => c.row === 0);
  const row1 = CHARS.filter((c) => c.row === 1);

  return (
    <div className="tangkhul-keyboard">
      <p className="keyboard-label">Quick insert — Tangkhul characters</p>
      <div className="keyboard-rows">
        {[row0, row1].map((row, ri) => (
          <div key={ri} className="keyboard-row">
            {row.map(({ label, char }) => (
              <button
                key={char}
                type="button"
                onClick={() => insertChar(char)}
                className="char-btn"
                title={`Insert ${char}`}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}