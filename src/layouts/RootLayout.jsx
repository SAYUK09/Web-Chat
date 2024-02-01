import { Outlet, Link } from "react-router-dom";

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
