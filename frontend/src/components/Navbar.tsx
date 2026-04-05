import { Link, NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Arroz con Code
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <NavLink
            to="/chat"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }
          >
            AI Chat
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) =>
              isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
            }
          >
            Community
          </NavLink>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }
              >
                Settings
              </NavLink>
              <button
                onClick={logout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
