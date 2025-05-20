import api from "../api/api";

export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post("admin/api/v1/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Login failed" };
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminInfo");
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get("/api/v1/admin/politicians");
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch politicians" };
  }
};

// Create politician
export const createPolitician = async (politicianData) => {
  try {
    const response = await api.post(
      "/admin/api/v1/politicians",
      politicianData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to create politician" };
  }
};

export const getPoliticianBySlug = async (slug) => {
  try {
    const response = await api.get(`/admin/api/v1/politicians/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to fetch politician" };
  }
};

// Update politician by slug
export const updatePolitician = async (slug, politicianData) => {
  try {
    const response = await api.put(
      `/admin/api/v1/politicians/${slug}`,
      politicianData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to update politician" };
  }
};

// Delete politician by slug
export const deletePolitician = async (slug) => {
  try {
    const response = await api.delete(`/admin/api/v1/politicians/${slug}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: "Failed to delete politician" };
  }
};

// Get dashboard statistics
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get("/admin/api/v1/politicians/dashboardStats");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch dashboard statistics" }
    );
  }
};

export const getAdminPoliticians = async () => {
  try {
    const response = await api.get("/admin/api/v1/politicians");
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || { error: "Failed to fetch dashboard statistics" }
    );
  }
};
