"use client";

import { useState, useRef, useEffect, useMemo } from "react";

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

  return (
    <div ref={ref} className="relative">
      <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 block">{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-left hover:border-zinc-400 dark:hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
      >
        <span className="truncate">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 text-zinc-400 flex-shrink-0 ml-2 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-xl overflow-hidden">
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-700">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded px-2.5 py-1.5 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {popularOptions.length > 0 && (
              <>
                {popularOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => { onChange(option.value); setIsOpen(false); setSearch(""); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      option.value === value
                        ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
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
                onClick={() => { onChange(option.value); setIsOpen(false); setSearch(""); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  option.value === value
                    ? "bg-orange-500/20 text-orange-600 dark:text-orange-400"
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
