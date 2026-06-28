import apiClient from "@/services/apiClient";

// Memberships
export const getMemberships = (params) =>
  apiClient.get("/memberships/", { params }).then((r) => r.data?.results ?? r.data);

export const getMembership = (id) =>
  apiClient.get(`/memberships/${id}/`).then((r) => r.data);

export const createMembership = (data) =>
  apiClient.post("/memberships/", data).then((r) => r.data);

export const bulkUploadMembers = async (file, organisationId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (organisationId != null) formData.append("organisation_id", organisationId);
  const r = await apiClient.post("/memberships/bulk-upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
};

export const updateMembership = (id, data) =>
  apiClient.patch(`/memberships/${id}/`, data).then((r) => r.data);

export const deleteMembership = (id) =>
  apiClient.delete(`/memberships/${id}/`).then((r) => r.data);

export const getMyMemberships = () =>
  apiClient.get("/memberships/my-memberships/").then((r) => r.data);

export const switchMembership = (id) =>
  apiClient.post(`/memberships/${id}/switch-membership/`).then((r) => r.data);

// Users
export const getUsers = (params) =>
  apiClient.get("/users/", { params }).then((r) => r.data?.results ?? r.data);

export const updateUser = (id, data) =>
  apiClient.patch(`/users/${id}/`, data).then((r) => r.data);

export const deactivateUser = (id) =>
  apiClient.delete(`/users/${id}/`).then((r) => r.data);
