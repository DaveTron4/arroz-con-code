import { Link } from "react-router";
import TranslateButton from "./TranslateButton";

type Category = "Education" | "Healthcare" | "Technology";

const CATEGORY_COLORS: Record<Category, string> = {
  Education: "bg-blue-50 text-blue-700",
  Healthcare: "bg-rose-50 text-rose-700",
  Technology: "bg-violet-50 text-violet-700",
};

interface PostCardProps {
  id: string;
  title: string;
  body: string;
  category: Category;
  authorName: string;
  createdAt: string;
}

export default function PostCard({
  id,
  title,
  body,
  category,
  authorName,
  createdAt,
}: PostCardProps) {
  return (
    <article className="border-b border-gray-100 px-4 py-4 hover:bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </span>
        <span className="text-xs text-gray-400">
          {authorName} · {createdAt}
        </span>
      </div>

      <Link to={`/post/${id}`} className="group">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">{body}</p>
      </Link>

      <div className="mt-3">
        <TranslateButton
          isTranslated={false}
          onTranslate={async () => {
            // TODO: call translation API
          }}
        />
      </div>
    </article>
  );
}
