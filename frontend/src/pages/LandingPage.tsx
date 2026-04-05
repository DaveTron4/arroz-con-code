import { Link } from "react-router";

export default function LandingPage() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-24 text-center">
      <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
        Resources for our community,{" "}
        <span className="text-blue-600">in our language</span>
      </h1>
      <p className="text-lg text-gray-500">
        Get bilingual answers on education, healthcare, and technology — powered
        by AI and built by the community.
      </p>
      <div className="flex gap-4">
        <Link
          to="/chat"
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700"
        >
          Ask AI
        </Link>
        <Link
          to="/community"
          className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50"
        >
          Join Community
        </Link>
      </div>
    </section>
  );
}
