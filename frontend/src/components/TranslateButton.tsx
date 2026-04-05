import { useState } from "react";

interface TranslateButtonProps {
  onTranslate: () => Promise<void>;
  isTranslated: boolean;
}

export default function TranslateButton({
  onTranslate,
  isTranslated,
}: TranslateButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    if (isTranslated) return;
    setLoading(true);
    setError(false);
    try {
      await onTranslate();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  if (isTranslated) {
    return (
      <span className="text-xs text-gray-400">Translated</span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
    >
      {loading ? (
        "Translating..."
      ) : (
        <>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 8l6 6" />
            <path d="M4 14l6-6 2-3" />
            <path d="M2 5h12" />
            <path d="M7 2h1" />
            <path d="M22 22l-5-10-5 10" />
            <path d="M14 18h6" />
          </svg>
          Translate
        </>
      )}
      {error && (
        <span className="ml-1 text-red-500">Failed — try again</span>
      )}
    </button>
  );
}
