import { Navigate } from "react-router-dom";
import { isSalesUserAuthenticated } from "./AuthStatus";

const PrivateRoute = ({ children }) => {
  const salesAuthenticated = isSalesUserAuthenticated();

  if (!salesAuthenticated) return <Navigate to="/" replace />;
  return children;
};

export default PrivateRoute;
