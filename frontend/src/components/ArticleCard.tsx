import { Link } from "react-router";
import { useFactCheck } from "../hooks/useApi";
import ProfessionalBadge from "./ProfessionalBadge";
import FactCheckBadge from "./FactCheckBadge";
import LikeButton from "./LikeButton";
import TranslateButton from "./TranslateButton";

type Category = "Education" | "Healthcare" | "Technology" | "New Tech";

const CATEGORY_COLORS: Record<Category, string> = {
  Education: "bg-blue-50 text-blue-700",
  Healthcare: "bg-rose-50 text-rose-700",
  Technology: "bg-violet-50 text-violet-700",
  "New Tech": "bg-violet-50 text-violet-700",
};

interface ArticleCardProps {
  post: {
    id: number;
    title: string;
    body: string;
    category: Category;
    createdAt: string;
    authorUsername: string;
    authorDisplayName?: string;
    locationName?: string;
    type?: "post" | "article";
  };
  isVerified?: boolean;
}

import { formatTime } from "../utils/formatTime";

export default function ArticleCard({
  post,
  isVerified = false,
}: ArticleCardProps) {
  const { factCheck, loading: factCheckLoading } = useFactCheck(post.id);
  const category = post.category as Category;
  const authorDisplay = post.authorDisplayName || post.authorUsername;
  const timeAgo = formatTime(post.createdAt);

  return (
    <article className="border-b border-gray-100 px-4 py-4 hover:bg-gray-50">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </span>
        {isVerified && <ProfessionalBadge />}
        
        {factCheck && (
          <FactCheckBadge
            status={factCheck.status as any}
            confidenceScore={factCheck.confidenceScore}
          />
        )}
        {factCheckLoading && <FactCheckBadge loading />}
        
        <span className="text-xs text-gray-400">
          {authorDisplay} · {timeAgo}
        </span>
      </div>

      <Link to={`/article/${post.id}`} className="group">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
          {post.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{post.body}</p>
      </Link>

      {post.locationName && (
        <p className="mt-2 text-xs text-gray-400">
          📍 {post.locationName}
        </p>
      )}

      <div className="mt-3 flex items-center gap-4">
        <LikeButton postId={post.id} />
        <TranslateButton
          postId={post.id}
          isTranslated={false}
          onTranslate={async () => {
            // Translation will be handled by TranslateButton component
          }}
        />
      </div>
    </article>
  );
}
