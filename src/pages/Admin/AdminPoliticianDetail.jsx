import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPoliticianBySlug } from "../../services/adminService";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPoliticianDetail() {
  const { slug } = useParams(); // Change from 'id' to 'slug'
  const [politician, setPolitician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadPolitician = async () => {
      setLoading(true);
      try {
        const data = await getPoliticianBySlug(slug); // Use slug directly
        setPolitician(data);
      } catch (err) {
        setError("Failed to load politician details");
      } finally {
        setLoading(false);
      }
    };

    loadPolitician();
  }, [slug]); // Use slug in dependency array

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !politician) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error || "Politician not found"}</p>
          <button
            onClick={() => navigate("/admin/politicians")}
            className="mt-2 text-blue-600 hover:underline"
          >
            Back to politicians list
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/admin/politicians")}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Politician Details
            </h1>
          </div>
          <Link
            to={`/admin/politicians/${politician.slug}/edit`} // Use politician.slug here
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
          >
            Edit Politician
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Left column - Image */}
            <div className="md:w-1/3 bg-gray-50 p-6 flex items-center justify-center">
              {politician.image_url ? (
                <img
                  src={politician.image_url}
                  alt={politician.full_name}
                  className="w-full max-w-sm rounded-lg object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `
                      <div class="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold">
                        ${politician.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold">
                  {politician.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
              )}
            </div>

            {/* Right column - Details */}
            <div className="md:w-2/3 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {politician.full_name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Party</h3>
                  <p className="mt-1 text-lg">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {politician.party}
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Position
                  </h3>
                  <p className="mt-1">{politician.position}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Region</h3>
                  <p className="mt-1">{politician.region}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Approval Rating
                  </h3>
                  <div className="mt-1">
                    {politician.total_votes > 0 ? (
                      <>
                        <div className="flex justify-between text-xs mb-1">
                          <span>
                            👍{" "}
                            {Math.round(
                              (politician.upvotes / politician.total_votes) *
                                100
                            )}
                            %
                          </span>
                          <span>
                            👎{" "}
                            {Math.round(
                              (politician.downvotes / politician.total_votes) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{
                              width: `${Math.round(
                                (politician.upvotes / politician.total_votes) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-sm">No votes yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  About
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {politician.about || "No biographical information available."}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Voting Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {politician.upvotes || 0}
                    </p>
                    <p className="text-xs text-gray-500">Upvotes</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {politician.downvotes || 0}
                    </p>
                    <p className="text-xs text-gray-500">Downvotes</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {politician.total_votes || 0}
                    </p>
                    <p className="text-xs text-gray-500">Total Votes</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  System Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">ID:</span> {politician.id}
                  </div>
                  <div>
                    <span className="font-medium">Slug:</span> {politician.slug}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(politician.created_at).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(politician.updated_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
