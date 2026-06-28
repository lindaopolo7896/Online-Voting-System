import apiClient from "@/services/apiClient";

// Elections
export const getElections = (params) =>
  apiClient.get("/elections/", { params }).then((r) => r.data?.results ?? r.data);

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
  apiClient.get(`/elections/${electionId}/election-positions/`).then((r) => r.data);

export const getElectionParticipants = (electionId) =>
  apiClient.get(`/elections/${electionId}/election-participants/`).then((r) => r.data);

export const getElectionCandidates = (electionId) =>
  apiClient.get(`/elections/${electionId}/election-candidates/`).then((r) => r.data);

export const deployElectionContract = (electionId) =>
  apiClient.post(`/elections/${electionId}/deploy-contract/`).then((r) => r.data);

export const enrollAllMembers = (electionId, roles) =>
  apiClient
    .post(`/elections/${electionId}/enroll-all-members/`, { roles })
    .then((r) => r.data);

export const sendVoterInvites = (electionId) =>
  apiClient.post(`/elections/${electionId}/send-voter-invites/`).then((r) => r.data);

// Positions (election-scoped)
export const getPositions = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/positions/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getPosition = (electionId, id) =>
  apiClient.get(`/elections/${electionId}/positions/${id}/`).then((r) => r.data);

export const createPosition = (electionId, data) =>
  apiClient.post(`/elections/${electionId}/positions/`, data).then((r) => r.data);

export const updatePosition = (electionId, id, data) =>
  apiClient.patch(`/elections/${electionId}/positions/${id}/`, data).then((r) => r.data);

export const deletePosition = (electionId, id) =>
  apiClient.delete(`/elections/${electionId}/positions/${id}/`).then((r) => r.data);
