import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isSalesUserAuthenticated } from "./AuthStatus";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const [authLoading, setAuthLoading] = useState(true);
  const [salesAuthenticated, setSalesAuthenticated] = useState(false);

  useEffect(() => {
    const authenticated = isSalesUserAuthenticated();
    console.debug("[auth] private route hydration", {
      path: location.pathname,
      authenticated,
    });

    setSalesAuthenticated(authenticated);
    setAuthLoading(false);
  }, [location.pathname]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Please wait...
      </div>
    );
  }

  if (!salesAuthenticated) {
    console.debug("[auth] private route redirect", {
      path: location.pathname,
      redirectTo: "/login",
    });
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
