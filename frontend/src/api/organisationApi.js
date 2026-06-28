import apiClient from "../services/apiClient";

//Organisations

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

//Elections

export const getElections = (params) =>
  apiClient
    .get("/elections/", { params })
    .then((r) => r.data?.results ?? r.data);

export const getElection = (id) =>
  apiClient.get(`/elections/${id}/`).then((r) => r.data);

export const createElection = (data) =>
  apiClient.post("/elections/", data).then((r) => r.data);

export const updateElection = (id, data) =>
  apiClient.patch(`/elections/${id}/`, data).then((r) => r.data);

export const deleteElection = (id) =>
  apiClient.delete(`/elections/${id}/`).then((r) => r.data);

export const getVoterTurnout = () =>
  apiClient.get("/elections/voter-turnout/").then((r) => r.data);

export const getElectionPositions = (electionId) =>
  apiClient
    .get(`/elections/${electionId}/election-positions/`)
    .then((r) => r.data);

export const getElectionParticipants = (electionId) =>
  apiClient
    .get(`/elections/${electionId}/election-participants/`)
    .then((r) => r.data);

export const getElectionCandidates = (electionId) =>
  apiClient
    .get(`/elections/${electionId}/election-candidates/`)
    .then((r) => r.data);

export const deployElectionContract = (electionId) =>
  apiClient
    .post(`/elections/${electionId}/deploy-contract/`)
    .then((r) => r.data);

export const enrollAllMembers = (electionId, roles) =>
  apiClient
    .post(`/elections/${electionId}/enroll-all-members/`, { roles })
    .then((r) => r.data);

export const sendVoterInvites = (electionId) =>
  apiClient
    .post(`/elections/${electionId}/send-voter-invites/`)
    .then((r) => r.data);

//  Positions

export const getPositions = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/positions/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getPosition = (electionId, id) =>
  apiClient
    .get(`/elections/${electionId}/positions/${id}/`)
    .then((r) => r.data);

export const createPosition = (electionId, data) =>
  apiClient
    .post(`/elections/${electionId}/positions/`, data)
    .then((r) => r.data);

export const updatePosition = (electionId, id, data) =>
  apiClient
    .patch(`/elections/${electionId}/positions/${id}/`, data)
    .then((r) => r.data);

export const deletePosition = (electionId, id) =>
  apiClient
    .delete(`/elections/${electionId}/positions/${id}/`)
    .then((r) => r.data);

//Participants

export const getParticipants = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/participants/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getParticipant = (electionId, id) =>
  apiClient
    .get(`/elections/${electionId}/participants/${id}/`)
    .then((r) => r.data);

export const createParticipant = (electionId, data) =>
  apiClient
    .post(`/elections/${electionId}/participants/`, data)
    .then((r) => r.data);

export const updateParticipant = (electionId, id, data) =>
  apiClient
    .patch(`/elections/${electionId}/participants/${id}/`, data)
    .then((r) => r.data);

export const deleteParticipant = (electionId, id) =>
  apiClient
    .delete(`/elections/${electionId}/participants/${id}/`)
    .then((r) => r.data);

export const bulkUploadParticipants = async (electionId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const r = await apiClient.post(
    `/elections/${electionId}/participants/bulk-upload/`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return r.data;
};

export const sendParticipantInvitations = (electionId) =>
  apiClient
    .post(`/elections/${electionId}/participants/send-invitations/`)
    .then((r) => r.data);

export const convertToCandidate = (electionId, participantId, data) =>
  apiClient
    .post(
      `/elections/${electionId}/participants/${participantId}/convert-to-candidate/`,
      data,
    )
    .then((r) => r.data);

//Candidates (election-scoped)

export const getCandidates = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/candidates/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getCandidate = (electionId, id) =>
  apiClient
    .get(`/elections/${electionId}/candidates/${id}/`)
    .then((r) => r.data);

export const createCandidate = (electionId, data) =>
  apiClient
    .post(`/elections/${electionId}/candidates/`, data)
    .then((r) => r.data);

export const updateCandidate = (electionId, id, data) =>
  apiClient
    .patch(`/elections/${electionId}/candidates/${id}/`, data)
    .then((r) => r.data);

export const deleteCandidate = (electionId, id) =>
  apiClient
    .delete(`/elections/${electionId}/candidates/${id}/`)
    .then((r) => r.data);

//Memberships

export const getMemberships = (params) =>
  apiClient
    .get("/memberships/", { params })
    .then((r) => r.data?.results ?? r.data);

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

// Permissions

export const bulkAssignPermissions = (data) =>
  apiClient.post("/permission-records/bulk-assign/", data).then((r) => r.data);

export const bulkUnassignPermissions = (data) =>
  apiClient
    .post("/permission-records/bulk-unassign/", data)
    .then((r) => r.data);

export const getMembershipPermissions = (membershipId) =>
  apiClient
    .get("/permission-records/get-membership-permissions/", {
      params: { membership_id: membershipId },
    })
    .then((r) => r.data);

//  Helpers

export const getElectionStatus = (election) => {
  const now = new Date();
  const start = new Date(election.date_time_occuring);
  const end = new Date(election.date_time_ending);
  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "live";
  return "completed";
};

export const formatElectionDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// Voting

export const getMyVotingLinks = () =>
  apiClient
    .get("/voting-links/my-links/")
    .then((r) => r.data?.results ?? r.data);

export const castVote = (data) =>
  apiClient.post("/votes/", data).then((r) => r.data);

//  Logs

export const getMembershipLogs = () =>
  apiClient.get("/logs/membership-logs/").then((r) => r.data);

export const getElectionLogs = (electionId) =>
  apiClient.get(`/logs/election-logs/${electionId}/`).then((r) => r.data);
