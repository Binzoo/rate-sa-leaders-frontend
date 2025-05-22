import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-6 py-4 shadow-md  p-4 fixed w-full z-50 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link
            className="text-2xl font-extrabold tracking-wide text-yellow-400"
            to="/"
          >
            🇿🇦 RateSALeaders
          </Link>
        </div>
        <ul className="flex space-x-6 text-sm font-semibold">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                  : "hover:text-yellow-200 transition"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/search-politician"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                  : "hover:text-yellow-200 transition"
              }
            >
              Politicians
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about-us"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                  : "hover:text-yellow-200 transition"
              }
            >
              About Us
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/login"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                  : "hover:text-yellow-200 transition"
              }
            >
              Admin
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
