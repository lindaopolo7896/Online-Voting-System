// Pure helpers for deriving/displaying election state (no network).

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
