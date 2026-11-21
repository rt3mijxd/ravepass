"use client";

import { useState, useRef, useEffect, useMemo, useId } from "react";

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface SearchableSelectProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  searchPlaceholder?: string;
}

export default function SearchableSelect({ label, options, value, onChange, searchPlaceholder = "Search..." }: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const controlId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const popularOptions = filtered.filter((o) => o.group === "popular");
  const allOptions = filtered.filter((o) => o.group !== "popular");

  function closeAndFocus() {
    setIsOpen(false);
    setSearch("");
    triggerRef.current?.focus();
  }

  return (
    <div ref={ref} className="relative min-w-0" onKeyDown={(event) => {
      if (!isOpen || event.key !== "Escape") return;
      event.stopPropagation();
      closeAndFocus();
    }}>
      <span id={`${controlId}-label`} className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <button
        type="button"
        ref={triggerRef}
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${controlId}-options` : undefined}
        aria-labelledby={`${controlId}-label ${controlId}-value`}
        onClick={() => {
          if (isOpen) closeAndFocus();
          else setIsOpen(true);
        }}
        className="rp-field flex min-h-11 w-full items-center justify-between px-3 text-left font-medium aria-expanded:border-orange-500"
      >
        <span id={`${controlId}-value`} className="truncate">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 flex-shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.65} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div id={`${controlId}-options`} className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="rp-field min-h-9 w-full px-2.5 placeholder-zinc-500 dark:placeholder-zinc-400"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {popularOptions.length > 0 && (
              <>
                {popularOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={option.value === value}
                    onClick={() => { onChange(option.value); closeAndFocus(); }}
                    className={`block min-h-10 w-full px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-600 ${
                      option.value === value
                        ? "bg-orange-500/15 font-semibold text-orange-800 dark:text-orange-300"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                {allOptions.length > 0 && (
                  <div className="border-t border-zinc-200 dark:border-zinc-700 my-0.5" />
                )}
              </>
            )}

            {allOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={option.value === value}
                onClick={() => { onChange(option.value); closeAndFocus(); }}
                className={`block min-h-10 w-full px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-orange-600 ${
                  option.value === value
                    ? "bg-orange-500/15 font-semibold text-orange-800 dark:text-orange-300"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {option.label}
              </button>
            ))}

            {filtered.length === 0 && (
              <p className="px-3 py-3 text-sm text-zinc-400 text-center">—</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
