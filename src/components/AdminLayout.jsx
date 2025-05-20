// src/components/AdminLayout.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutAdmin } from "../services/adminService";

export default function AdminLayout({ children }) {
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get admin info from localStorage
    const adminInfo = localStorage.getItem("adminInfo");
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    } else {
      // Redirect to login if not authenticated
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Politicians", path: "/admin/politicians", icon: "👥" },
    // Add more nav items as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-green-800 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-green-700">
          <h1 className="text-xl font-bold">RateSA Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-6 border-b border-green-700">
          {admin && (
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-sm font-medium">{admin.name}</p>

                <p className="text-xs text-green-300">{admin.email}</p>
              </div>
            </div>
          )}
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`)
                      ? "bg-green-700 text-white"
                      : "text-green-100 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-white hover:bg-green-700 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ☰
            </button>
            <div className="flex items-center">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-green-600"
              >
                View Website
              </a>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
