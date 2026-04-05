import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUITranslation } from "../hooks/useUITranslation";

export default function SettingsPage() {
  const { user, updateLanguagePreference, logout } = useAuth();
  const { t, language } = useUITranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "es">(language as "en" | "es");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (user?.preferredLanguage) {
      setSelectedLanguage(user.preferredLanguage);
    }
  }, [user?.preferredLanguage]);

  const handleLanguageChange = async (newLanguage: "en" | "es") => {
    if (newLanguage === selectedLanguage) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      await updateLanguagePreference(newLanguage);
      setSelectedLanguage(newLanguage);
      setMessage({ type: "success", text: t("languageSaved") });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setMessage({ type: "error", text: t("languageError") });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    if (window.confirm(t("signOutConfirm"))) {
      logout();
    }
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">{t("settingsTitle")}</h1>

      {/* Language Preference Section */}
      <div className="mb-8 rounded-lg border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("preferredLanguage")}</h2>
        <p className="mb-4 text-sm text-gray-600">{t("selectLanguage")}</p>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="language"
              value="en"
              checked={selectedLanguage === "en"}
              onChange={() => handleLanguageChange("en")}
              disabled={loading}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">{t("english")}</span>
          </label>
          
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="language"
              value="es"
              checked={selectedLanguage === "es"}
              onChange={() => handleLanguageChange("es")}
              disabled={loading}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">{t("spanish")}</span>
          </label>
        </div>

        {message && (
          <div
            className={`mt-4 rounded-md p-3 text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Sign Out Section */}
      <div className="border-t border-gray-200 pt-8">
        <button
          onClick={handleSignOut}
          className="rounded-md border border-red-200 px-6 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          {t("signOut")}
        </button>
      </div>
    </section>
  );
} 