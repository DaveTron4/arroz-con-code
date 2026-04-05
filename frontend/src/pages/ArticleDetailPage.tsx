import { useParams } from "react-router";
import ProfessionalBadge from "../components/ProfessionalBadge";
import TranslateButton from "../components/TranslateButton";

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section className="mx-auto max-w-2xl px-4 py-8">
      {/* Category badge */}
      <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
        Healthcare
      </span>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">
        Article #{id} title goes here
      </h1>

      {/* Author info */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
          D
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Dr. Author Name</p>
          <ProfessionalBadge />
        </div>
        <span className="ml-auto text-xs text-gray-400">2h ago</span>
      </div>

      <div className="mt-2">
        <TranslateButton
          isTranslated={false}
          onTranslate={async () => {
            // TODO: call translation API with article id
          }}
        />
      </div>

      {/* Article body */}
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-700">
        <p>Article body content goes here. This page is public — anyone can read it.</p>
      </div>
    </section>
  );
}
