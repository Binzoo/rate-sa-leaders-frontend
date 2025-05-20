import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminToken") !== null;

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
