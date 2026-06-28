import apiClient from "@/services/apiClient";

// Participants (election-scoped) — the admin-facing "voters" of an election.
export const getParticipants = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/participants/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getParticipant = (electionId, id) =>
  apiClient.get(`/elections/${electionId}/participants/${id}/`).then((r) => r.data);

export const createParticipant = (electionId, data) =>
  apiClient.post(`/elections/${electionId}/participants/`, data).then((r) => r.data);

export const updateParticipant = (electionId, id, data) =>
  apiClient.patch(`/elections/${electionId}/participants/${id}/`, data).then((r) => r.data);

export const deleteParticipant = (electionId, id) =>
  apiClient.delete(`/elections/${electionId}/participants/${id}/`).then((r) => r.data);

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
