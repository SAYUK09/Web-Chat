import { Outlet, Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export const PrivateRoute = ({ children, redirectTo }) => {
  const { user } = useAuth();
  const isAuthenticated = user?.uid.length;

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export const RootLayout = () => {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-dark-background p-8 px-12">
      <Outlet />
    </main>
  );
};
