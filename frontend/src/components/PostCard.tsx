import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useFactCheck } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { CATEGORY_COLORS } from "../utils/categories";
import type { Post, Category } from "../types";
import { factCheckAPI } from "../services/api";
import FactCheckBadge from "./FactCheckBadge";
import LikeButton from "./LikeButton";
import TranslateButton from "./TranslateButton";

interface PostCardProps {
  post: Post;
}

// Helper to format relative time
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return "now";
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)}d ago`;

  return date.toLocaleDateString();
}

// Detect language of text (same logic as backend)
function detectLanguage(text: string): "en" | "es" {
  const spanishWords = [
    "el",
    "la",
    "de",
    "y",
    "que",
    "es",
    "en",
    "por",
    "con",
    "para",
    "una",
    "los",
    "como",
    "está",
    "pero",
    "más",
    "sido",
    "fue",
    "ó",
    "á",
    "é",
    "í",
    "ú",
    "ñ",
  ];

  const lowerText = text.toLowerCase();

  // Check for Spanish-specific characters
  if (/[áéíóúñ¿¡]/i.test(text)) {
    return "es";
  }

  // Count Spanish words
  const words = lowerText.split(/\s+/);
  const spanishWordCount = words.filter((word) =>
    spanishWords.includes(word),
  ).length;

  // If more than 30% of words are common Spanish words, likely Spanish
  if (words.length > 0 && spanishWordCount / words.length > 0.3) {
    return "es";
  }

  return "en";
}

export default function PostCard({ post }: PostCardProps) {
  const {
    factCheck,
    loading: factCheckLoading,
    refetch: refetchFactCheck,
  } = useFactCheck(post.id);
  const { user } = useAuth();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isShowingTranslated, setIsShowingTranslated] = useState(false);
  const [needsTranslation, setNeedsTranslation] = useState(false);
  const [isAutoTranslating, setIsAutoTranslating] = useState(false);

  const category = post.category as Category;
  const authorDisplay = post.authorDisplayName || post.authorUsername;
  const timeAgo = formatTime(post.createdAt);

  // Display original or translated body
  const displayBody =
    isShowingTranslated && translatedText ? translatedText : post.body;

  // Check if auto-translation is needed
  useEffect(() => {
    if (user?.preferredLanguage) {
      const postLanguage = detectLanguage(post.body);
      const needsAutoTranslation = postLanguage !== user.preferredLanguage;
      setNeedsTranslation(needsAutoTranslation);
    }
  }, [post.body, user?.preferredLanguage]);

  const handleTranslated = (body: string) => {
    setTranslatedText(body);
    setIsShowingTranslated(true);
  };

  // Auto-translate if needed
  useEffect(() => {
    if (
      needsTranslation &&
      user?.preferredLanguage &&
      !isShowingTranslated &&
      !isAutoTranslating
    ) {
      setIsAutoTranslating(true);
      // The auto-translation will happen automatically when needed
      // We'll let the user manually trigger translation if they want
    }
  }, [
    needsTranslation,
    user?.preferredLanguage,
    isShowingTranslated,
    isAutoTranslating,
  ]);

  // Auto-trigger fact-check if not yet checked
  useEffect(() => {
    if (factCheck && !factCheck.isFactChecked && post.id) {
      // Trigger fact-check and refetch results
      factCheckAPI
        .triggerFactCheck(post.id)
        .then(() => {
          // Refetch fact-check data after triggering
          setTimeout(() => refetchFactCheck(), 500);
        })
        .catch(() => {
          console.log(
            "Fact-check trigger started (results will update when available)",
          );
        });
    }
  }, [factCheck?.isFactChecked, post.id, refetchFactCheck]);

  return (
    <article className="border-b border-gray-100 px-4 py-4 hover:bg-gray-50">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {post.type === "article" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
            📰 Article
          </span>
        )}
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </span>

        {factCheck && (
          <FactCheckBadge
            status={factCheck.status as any}
            confidenceScore={factCheck.confidenceScore}
          />
        )}
        {factCheckLoading && <FactCheckBadge loading />}

        {needsTranslation && !isShowingTranslated && (
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
            🌐 Available in{" "}
            {user?.preferredLanguage === "es" ? "Spanish" : "English"}
          </span>
        )}

        <span className="text-xs text-gray-400">
          {authorDisplay} · {timeAgo}
        </span>
      </div>

      <Link to={`/post/${post.id}`} className="group">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{displayBody}</p>
      </Link>

      {post.locationName && (
        <p className="mt-2 text-xs text-gray-400">📍 {post.locationName}</p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <LikeButton postId={post.id} />
        <TranslateButton
          postId={post.id}
          isTranslated={isShowingTranslated}
          onTranslated={handleTranslated}
        />
      </div>
    </article>
  );
}
