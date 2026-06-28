import apiClient from "@/services/apiClient";

// Candidates (election-scoped)
export const getCandidates = (electionId, params) =>
  apiClient
    .get(`/elections/${electionId}/candidates/`, { params })
    .then((r) => r.data?.results ?? r.data);

export const getCandidate = (electionId, id) =>
  apiClient.get(`/elections/${electionId}/candidates/${id}/`).then((r) => r.data);

export const createCandidate = (electionId, data) =>
  apiClient.post(`/elections/${electionId}/candidates/`, data).then((r) => r.data);

export const updateCandidate = (electionId, id, data) =>
  apiClient.patch(`/elections/${electionId}/candidates/${id}/`, data).then((r) => r.data);

// Multipart update — needed when a campaign photo file is included.
export const updateCandidateProfile = async (
  electionId,
  id,
  { slogan, manifesto, campaign_photos },
) => {
  const fd = new FormData();
  if (slogan != null) fd.append("slogan", slogan);
  if (manifesto != null) fd.append("manifesto", manifesto);
  if (campaign_photos instanceof File) fd.append("campaign_photos", campaign_photos);
  const r = await apiClient.patch(`/elections/${electionId}/candidates/${id}/`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return r.data;
};

export const deleteCandidate = (electionId, id) =>
  apiClient.delete(`/elections/${electionId}/candidates/${id}/`).then((r) => r.data);
