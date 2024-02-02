import { Outlet, Link, useNavigate } from "react-router-dom";
import { Navigate, Route } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { useEffect, useState } from "react";

export const PrivateRoute = ({ element }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== null) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    // You can show a loading spinner or any other loading indicator
    return null;
  }

  if (user && user.uid && user.uid.length) {
    return element;
  }

  console.log("Redirecting to /login");
  return <Navigate to="/login" />;
};

export const RootLayout = () => {
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <nav className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">
            <Link to="/">WEB CHAT</Link>
          </div>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <Outlet />
    </main>
  );
};
