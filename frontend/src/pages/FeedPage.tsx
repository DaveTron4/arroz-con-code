import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import ArticleCard from "../components/ArticleCard";

type Category = "All" | "Education" | "Healthcare" | "Technology";
const CATEGORIES: Category[] = ["All", "Education", "Healthcare", "Technology"];

export default function FeedPage() {
  const [locationDenied, setLocationDenied] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (_pos) => {
        // TODO: pass coords to feed API
        // fetchFeed({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      () => setLocationDenied(true),
    );
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Location fallback */}
      {locationDenied && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-amber-50 px-4 py-3">
          <span className="text-sm text-amber-700">
            Location access denied.
          </span>
          <input
            type="text"
            value={zipInput}
            onChange={(e) => setZipInput(e.target.value)}
            placeholder="Enter city or zip code"
            className="flex-1 rounded-md border border-amber-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-amber-400"
          />
          <button className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700">
            Go
          </button>
        </div>
      )}

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto border-b border-gray-100 px-4 py-3 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feed items — placeholder content until API is wired */}
      <div>
        <ArticleCard
          id="1"
          title="Free health clinics in your area this weekend"
          body="Several community health clinics are offering free checkups and vaccinations this Saturday and Sunday for residents within the county."
          category="Healthcare"
          authorName="Dr. Maria Gonzalez"
          isVerified={true}
          createdAt="2h ago"
        />
        <PostCard
          id="2"
          title="How do I apply for FAFSA if I don't have a Social Security number?"
          body="My younger sibling wants to go to community college but we're not sure how to fill out the FAFSA. Has anyone been in this situation?"
          category="Education"
          authorName="javier_m"
          createdAt="4h ago"
        />
        <ArticleCard
          id="3"
          title="5 free AI tools that can actually help you at work"
          body="You don't need to pay for expensive software. Here are five free tools being used by small business owners in our community right now."
          category="Technology"
          authorName="Carlos Reyes"
          isVerified={true}
          createdAt="1d ago"
        />
        <PostCard
          id="4"
          title="Good dentists that accept Medi-Cal near downtown?"
          body="Looking for a dentist who accepts Medi-Cal. My daughter needs a cleaning and I haven't been able to find one that's taking new patients."
          category="Healthcare"
          authorName="rosa_flores"
          createdAt="1d ago"
        />
      </div>
    </div>
  );
}
