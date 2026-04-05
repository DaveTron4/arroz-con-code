import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Settings</h1>
      <form className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="displayName">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="Your name"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="Leave blank to keep current"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="language">
            Preferred Language
          </label>
          <select
            id="language"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
        <button
          type="submit"
          className="self-start rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </form>

      <hr className="my-8 border-gray-200" />

      <button
        onClick={handleLogout}
        className="rounded-md border border-red-200 px-6 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Sign Out
      </button>
    </section>
  );
}
