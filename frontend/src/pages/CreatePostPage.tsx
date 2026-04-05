import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCreatePost } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useUITranslation } from "../hooks/useUITranslation";

const CATEGORIES = ["Education", "Healthcare", "New Tech"] as const;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createPost, loading, error } = useCreatePost();
  const { t } = useUITranslation();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Education");
  const [locationName, setLocationName] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isArticle, setIsArticle] = useState(false);
  const isProfessional = user?.role === "professional";

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: { pathname: "/create" } } });
    }
  }, [isAuthenticated, navigate]);

  // Get user's geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setGeoError(t("locationDenied"));
          console.log("Geolocation error:", err.message);
        }
      );
    }
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Check authentication first
    if (!isAuthenticated) {
      setFormError(t("signOutConfirm"));
      navigate("/signin", { state: { from: { pathname: "/create" } } });
      return;
    }

    // Validation
    if (!title.trim()) {
      setFormError(t("titleRequired"));
      return;
    }
    if (!body.trim()) {
      setFormError(t("bodyRequired"));
      return;
    }

    try {
      // Only professionals can create articles
      if (isArticle && !isProfessional) {
        setFormError(t("onlyProfessionalsArticles"));
        return;
      }

      const postData = {
        title: title.trim(),
        body: body.trim(),
        category,
        type: isArticle ? "article" : "post",
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        locationName: locationName || undefined,
      };

      console.log('Creating post with data:', postData);
      const newPost = await createPost(postData);
      console.log('Post created:', newPost);
      
      // Redirect to post detail page
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : t("postError");
      console.error("Error creating post:", errorMsg);
      // Error is already set in the hook, but let's ensure it's displayed
      if (!error) {
        setFormError(errorMsg);
      }
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{isArticle ? t("createArticle") : t("createPost")}</h1>
      
      {(formError || error) && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {formError || error}
        </div>
      )}

      {coordinates && (
        <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
          📍 {t("location")}: {coordinates.latitude.toFixed(4)}, {coordinates.longitude.toFixed(4)}
        </div>
      )}

      {geoError && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-700">
          ⚠️ {geoError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="title">
            {t("title")}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("title")}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="body">
            {t("content")}
          </label>
          <textarea
            id="body"
            rows={6}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={t("content")}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="category">
            {t("category")}
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {isProfessional && (
          <div className="flex items-center gap-2 rounded-md bg-indigo-50 p-3">
            <input
              id="isArticle"
              type="checkbox"
              checked={isArticle}
              onChange={(e) => setIsArticle(e.target.checked)}
              disabled={loading}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isArticle" className="text-sm font-medium text-gray-700">
              📰 {t("createArticle")}
            </label>
          </div>
        )}

        {coordinates && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="locationName">
              {t("location")} ({t("save") === "Save" ? "Optional" : "Opcional"})
            </label>
            <input
              id="locationName"
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g., New York, NY"
              disabled={loading}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="self-start rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? t("publishing") : t("publish")}
        </button>
      </form>
    </section>
  );
}
