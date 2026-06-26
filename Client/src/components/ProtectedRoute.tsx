import { Navigate } from "react-router-dom";

interface interfaceProp {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: interfaceProp) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
