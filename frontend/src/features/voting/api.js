import apiClient from "@/services/apiClient";

// A voter's own voting links.
export const getMyVotingLinks = () =>
  apiClient.get("/voting-links/my-links/").then((r) => r.data?.results ?? r.data);

// Cast a ballot.
export const castVote = (data) =>
  apiClient.post("/votes/", data).then((r) => r.data);
