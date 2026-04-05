import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useUITranslation } from "../hooks/useUITranslation";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useUITranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Arroz con Code
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
            }
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive ? "text-indigo-600" : "text-gray-600 hover:text-gray-900"
            }
          >
            {t("community")}
          </NavLink>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                {t("settings")}
              </NavLink>
              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
              >
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-600 hover:text-gray-900">
                {t("signIn")}
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-white hover:bg-indigo-700"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
