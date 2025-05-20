import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminPoliticians,
  deletePolitician,
} from "../../services/adminService";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPoliticiansList() {
  const [politicians, setPoliticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadPoliticians();
  }, []);

  const loadPoliticians = async () => {
    setLoading(true);
    try {
      const data = await getAdminPoliticians();
      setPoliticians(data);
    } catch (err) {
      setError("Failed to load politicians");
    } finally {
      setLoading(false);
    }
  };

  // Get unique parties for filter dropdown
  const parties = [...new Set(politicians.map((p) => p.party))].sort();

  // Filter politicians by search term and party
  const filteredPoliticians = politicians.filter((politician) => {
    const matchesSearch =
      searchTerm === "" ||
      politician.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesParty =
      selectedParty === "" || politician.party === selectedParty;

    return matchesSearch && matchesParty;
  });

  const handleDelete = async (slug) => {
    try {
      await deletePolitician(slug);
      setPoliticians(politicians.filter((p) => p.slug !== slug));
      setDeleteConfirm(null);
    } catch (err) {
      setError("Failed to delete politician");
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Politicians
          </h1>
          <Link
            to="/admin/politicians/new"
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
          >
            Add New Politician
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Parties</option>
              {parties.map((party) => (
                <option key={party} value={party}>
                  {party}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedParty("");
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Reset Filters
          </button>
        </div>

        {/* Politicians Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-500">Loading politicians...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Politician
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Votes
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPoliticians.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No politicians found
                      </td>
                    </tr>
                  ) : (
                    filteredPoliticians.map((politician) => (
                      <tr key={politician.slug} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {politician.image_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={politician.image_url}
                                  alt={politician.full_name}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentNode.classList.add(
                                      "bg-gray-200",
                                      "flex",
                                      "items-center",
                                      "justify-center"
                                    );
                                    e.target.parentNode.innerHTML = `<span class="text-gray-500 text-sm font-medium">${politician.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}</span>`;
                                  }}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-sm font-medium">
                                    {politician.full_name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .substring(0, 2)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {politician.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {politician.position}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {politician.party}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {politician.region}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <span className="text-green-500">
                              {politician.upvotes || 0} 👍
                            </span>{" "}
                            /
                            <span className="ml-1 text-red-500">
                              {politician.downvotes || 0} 👎
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Total: {politician.total_votes || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link
                              to={`/admin/politicians/${politician.slug}/view`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </Link>
                            <Link
                              to={`/admin/politicians/${politician.slug}/edit`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => setDeleteConfirm(politician.slug)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this politician? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
