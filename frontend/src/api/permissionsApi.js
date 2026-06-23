import apiClient from "../services/apiClient";

function unwrap(data) {
  return Array.isArray(data) ? data : (data?.results ?? []);
}

export const getMemberships = () =>
  apiClient.get("/memberships/").then((r) => unwrap(r.data));

export const getMyMemberships = () =>
  apiClient.get("/memberships/my_memberships/").then((r) => unwrap(r.data));

export const getMembershipPermissions = (membershipId) =>
  apiClient
    .get(`/permission-records/get_membership_permissions/?membership_id=${membershipId}`)
    .then((r) => unwrap(r.data));

export const bulkAssignPermissions = ({ membership_id, permissions, type = "organisation", election_id }) =>
  apiClient
    .post("/permission-records/bulk_assign/", { type, membership_id, permissions, election_id })
    .then((r) => r.data);

export const bulkUnassignPermissions = ({ membership_id, permissions, type = "organisation" }) =>
  apiClient
    .post("/permission-records/bulk_unassign/", { type, membership_id, permissions })
    .then((r) => r.data);
