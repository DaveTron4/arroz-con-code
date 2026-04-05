import { useState, useEffect, useRef } from "react";
import { locationsAPI } from "../services/api";

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
  type: string;
  category: string;
}

interface SearchEntry {
  query: string;
  keywords: string[];
  results: LocationResult[];
  timestamp: number;
}

const STORAGE_KEY = "ai_search_history";

function loadHistory(): SearchEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(history: SearchEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AISearchModal({ isOpen, onClose }: Props) {
  const [history, setHistory] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"pending" | "granted" | "denied">("pending");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setHistory(loadHistory());
    setTimeout(() => inputRef.current?.focus(), 100);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationStatus("granted");
        },
        () => setLocationStatus("denied")
      );
    } else {
      setLocationStatus("denied");
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const q = query.trim();
    setQuery("");
    setLoading(true);

    try {
      const data = await locationsAPI.aiSearch({
        query: q,
        latitude: coords?.lat,
        longitude: coords?.lng,
      });

      const entry: SearchEntry = {
        query: q,
        keywords: data.keywords,
        results: data.results,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        const updated = [...prev, entry];
        saveHistory(updated);
        return updated;
      });
    } catch {
      setHistory((prev) => {
        const entry: SearchEntry = {
          query: q,
          keywords: [],
          results: [],
          timestamp: Date.now(),
        };
        const updated = [...prev, entry];
        saveHistory(updated);
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900">AI Search</h2>
          {locationStatus === "granted" && (
            <p className="text-xs text-green-600">Location detected</p>
          )}
          {locationStatus === "denied" && (
            <p className="text-xs text-gray-400">Location unavailable — results may vary</p>
          )}
          {locationStatus === "pending" && (
            <p className="text-xs text-gray-400">Detecting location…</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {history.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-3">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <p className="text-sm text-gray-400 max-w-xs">
              Find nearby Spanish-speaking hospitals, clinics, legal aid, and more.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry, i) => {
              const placeName = (place: LocationResult) =>
                place.address?.amenity ||
                place.address?.building ||
                place.address?.hospital ||
                place.address?.clinic ||
                place.display_name.split(",")[0];

              const placeAddr = (place: LocationResult) =>
                [place.address?.road, place.address?.city, place.address?.state]
                  .filter(Boolean)
                  .join(", ");

              return (
                <div key={i} className="space-y-3">
                  {/* User query bubble */}
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white text-sm rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                      {entry.query}
                    </div>
                  </div>

                  {/* Result cards */}
                  {entry.results.length === 0 ? (
                    <p className="text-sm text-gray-400 pl-1">No results found nearby. Try a different search.</p>
                  ) : (
                    <div className="space-y-2">
                      {entry.results.slice(0, 6).map((place) => {
                        const name = placeName(place);
                        const addr = placeAddr(place);
                        const googleUrl = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`;
                        const appleUrl = `https://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${place.lat},${place.lon}`;

                        return (
                          <div key={place.place_id} className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 leading-snug">{name}</p>
                            {addr && (
                              <p className="text-xs text-gray-500 mt-0.5">{addr}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                              <a
                                href={googleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:underline"
                              >
                                Google Maps
                              </a>
                              <span className="text-gray-300 text-xs">·</span>
                              <a
                                href={appleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-blue-600 hover:underline"
                              >
                                Apple Maps
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start py-2">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 px-4 py-3 flex gap-2 bg-white"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find hospitals with Spanish translators…"
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!query.trim() || loading}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          aria-label="Send"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
