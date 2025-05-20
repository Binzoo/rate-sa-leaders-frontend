// src/pages/AdminPoliticianForm.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPoliticianBySlug,
  createPolitician,
  updatePolitician,
} from "../../services/adminService";
import AdminLayout from "../../components/AdminLayout";

export default function AdminPoliticianForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEditMode = slug !== undefined;

  const [formData, setFormData] = useState({
    full_name: "",
    party: "",
    position: "",
    region: "",
    about: "",
    image_url: "",
    slug: "",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const loadPolitician = async () => {
        try {
          const data = await getPoliticianBySlug(slug);
          setFormData({
            full_name: data.full_name || "",
            party: data.party || "",
            position: data.position || "",
            region: data.region || "",
            about: data.about || "",
            image_url: data.image_url || "",
            slug: data.slug || "",
          });
        } catch (err) {
          setError("Failed to load politician data");
        } finally {
          setLoading(false);
        }
      };

      loadPolitician();
    }
  }, [slug, isEditMode]);

  // Auto-generate slug when name changes (but only if slug hasn't been manually edited)
  useEffect(() => {
    if (!isEditMode && !isSlugManuallyEdited && formData.full_name) {
      const generatedSlug = formData.full_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setFormData((prev) => ({
        ...prev,
        slug: generatedSlug,
      }));
    }
  }, [formData.full_name, isEditMode, isSlugManuallyEdited]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "slug") {
      setIsSlugManuallyEdited(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Validate the slug format
      if (!formData.slug) {
        setError("Slug cannot be empty");
        setSubmitting(false);
        return;
      }

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
        setError(
          "Slug format is invalid. Use only lowercase letters, numbers, and hyphens."
        );
        setSubmitting(false);
        return;
      }

      if (isEditMode) {
        await updatePolitician(slug, formData);
        setSuccess("Politician updated successfully");

        // If the slug was changed, redirect to the new edit URL
        if (slug !== formData.slug) {
          setTimeout(() => {
            navigate(`/admin/politicians/${formData.slug}/edit`, {
              replace: true,
            });
          }, 1500);
        }
      } else {
        const result = await createPolitician(formData);
        setSuccess("Politician created successfully");

        // Redirect to edit page after creation
        if (result && result.slug) {
          setTimeout(() => {
            navigate(`/admin/politicians/${result.slug}/edit`);
          }, 1500);
        }

        // Reset form after successful creation if not redirecting
        if (!result || !result.slug) {
          setFormData({
            full_name: "",
            party: "",
            position: "",
            region: "",
            about: "",
            image_url: "",
            slug: "",
          });
          setIsSlugManuallyEdited(false);
        }
      }
    } catch (err) {
      setError(err.error || "Failed to save politician");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
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
              {isEditMode ? "Edit Politician" : "Add New Politician"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg overflow-hidden p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. John Smith"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *{" "}
                <span className="text-xs text-gray-500">
                  (URL-friendly identifier)
                </span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. john-smith"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Use lowercase letters, numbers, and hyphens only. This will be
                part of the URL.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Party *
              </label>
              <input
                type="text"
                name="party"
                value={formData.party}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. ANC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region *
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Gauteng"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. Member of Parliament"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-2">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Biographical information about the politician..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/politicians")}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 rounded-md text-white ${
                submitting
                  ? "bg-green-600 opacity-70 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting
                ? "Saving..."
                : isEditMode
                ? "Update Politician"
                : "Create Politician"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
