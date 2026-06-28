import apiClient from "@/services/apiClient";

// Organisations
export const getOrganisations = () =>
  apiClient.get("/organisations/").then((r) => r.data?.results ?? r.data);

export const getOrganisation = (id) =>
  apiClient.get(`/organisations/${id}/`).then((r) => r.data);

export const updateOrganisation = (id, data) =>
  apiClient.patch(`/organisations/${id}/`, data).then((r) => r.data);

export const deleteOrganisation = (id) =>
  apiClient.delete(`/organisations/${id}/`).then((r) => r.data);

export const getOrganisationElectionStats = (id) =>
  apiClient.get(`/organisations/${id}/election-stats/`).then((r) => r.data);

// Logs
export const getMembershipLogs = () =>
  apiClient.get("/logs/membership-logs/").then((r) => r.data);

export const getElectionLogs = (electionId) =>
  apiClient.get(`/logs/election-logs/${electionId}/`).then((r) => r.data);

// NOTE: these permission helpers use hyphenated action paths and are NOT used
// anywhere (the live ones live in features/permissions/api.js with underscore
// paths). Kept only to preserve the original organisationApi export surface.
export const bulkAssignPermissions = (data) =>
  apiClient.post("/permission-records/bulk-assign/", data).then((r) => r.data);

export const bulkUnassignPermissions = (data) =>
  apiClient.post("/permission-records/bulk-unassign/", data).then((r) => r.data);

export const getMembershipPermissions = (membershipId) =>
  apiClient
    .get("/permission-records/get-membership-permissions/", {
      params: { membership_id: membershipId },
    })
    .then((r) => r.data);
