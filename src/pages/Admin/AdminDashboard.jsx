// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { getAdminDashboardStats } from "../../services/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <AdminLayout>
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white h-32 rounded-lg shadow-md"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-gray-500 text-sm font-medium">
                Total Politicians
              </h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalPoliticians || 0}
              </p>
              <Link
                to="/admin/politicians"
                className="text-green-600 text-sm hover:underline mt-4 inline-block"
              >
                View all politicians →
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-gray-500 text-sm font-medium">Total Votes</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalVotes || 0}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-gray-500 text-sm font-medium">
                Most Popular Party
              </h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.mostPopularParty || "N/A"}
              </p>
              <p className="text-green-600 text-sm mt-2">
                {stats?.mostPopularPartyAvgRating
                  ? `${stats.mostPopularPartyAvgRating}% approval`
                  : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
