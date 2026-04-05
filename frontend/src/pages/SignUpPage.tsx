import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
    locationName: "",
    preferredLanguage: "en" as "en" | "es",
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [geolocationStatus, setGeolocationStatus] = useState<
    "idle" | "loading" | "success" | "denied"
  >("idle");

  // Get user's geolocation on component mount
  useState(() => {
    if (navigator.geolocation) {
      setGeolocationStatus("loading");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setGeolocationStatus("success");
        },
        () => {
          setGeolocationStatus("denied");
        },
      );
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "preferredLanguage" ? (value as "en" | "es") : value,
    }));
    setLocalError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    // Validation
    if (!formData.username.trim()) {
      setLocalError("Username is required");
      return;
    }
    if (!formData.email.trim()) {
      setLocalError("Email is required");
      return;
    }
    if (formData.password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        latitude: formData.latitude,
        longitude: formData.longitude,
        locationName: formData.locationName || undefined,
        preferredLanguage: formData.preferredLanguage,
      });
      // Redirect to feed on success
      navigate("/", { replace: true });
    } catch (err) {
      // Error is already set in context, but we also keep local error
      setLocalError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const displayError = localError || error;

  return (
    <section className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>

      {displayError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {displayError}
        </div>
      )}

      {geolocationStatus === "denied" && (
        <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Location access denied. You can add your location manually.
        </div>
      )}

      {geolocationStatus === "success" && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          ✓ Location detected
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="password"
          >
            Password
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
          <p className="text-xs text-gray-500">At least 8 characters</p>
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="locationName"
          >
            City/Location (Optional)
          </label>
          <input
            id="locationName"
            name="locationName"
            type="text"
            placeholder="Atlanta, GA"
            value={formData.locationName}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          />
          {formData.latitude && formData.longitude && (
            <p className="text-xs text-gray-500">
              Coordinates: {formData.latitude.toFixed(4)},{" "}
              {formData.longitude.toFixed(4)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium text-gray-700"
            htmlFor="preferredLanguage"
          >
            Preferred Language
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={formData.preferredLanguage}
            onChange={handleChange}
            disabled={loading}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/signin" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </section>
  );
}
