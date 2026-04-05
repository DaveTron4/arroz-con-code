import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useUITranslation } from "../hooks/useUITranslation";

export default function SignInPage() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useUITranslation();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.username.trim()) {
      setLocalError(t("usernameRequired"));
      return;
    }
    if (!formData.password) {
      setLocalError(t("passwordRequired"));
      return;
    }

    try {
      await login(formData.username, formData.password);
      // Redirect to where they came from or to home
      const from = location.state?.from?.pathname ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : t("loginFailed"));
    }
  };

  const displayError = localError || error;

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">{t("welcomeBack")}</h1>
      
      {displayError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="username">
            {t("username")}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="maria_garcia"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? t("signingIn") : t("signIn")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        {t("noAccount")}{" "}
        <Link to="/signup" className="text-indigo-600 hover:underline">
          {t("signUp")}
        </Link>
      </p>
    </section>
  );
}
