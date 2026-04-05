import { Navigate, useLocation } from "react-router";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProfessionalRouteProps {
  children: ReactNode;
}

export default function ProfessionalRoute({ children }: ProfessionalRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!user?.isVerified) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Verification Required
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Only verified professionals can publish articles. If you are a
          professional, please contact us to complete verification.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
