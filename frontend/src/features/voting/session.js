// The voter's verified voting session, kept in sessionStorage for the duration of
// the "one sitting" voting flow. Built from the verify-otp response (which, when a
// voting_token is supplied, returns the eligibility + full ballot). This is what the
// details/instructions/vote pages read from — the flow never calls the permission-
// gated dashboard endpoints.

const SESSION_KEY = "votingSession";

// Build a session object from the verify-otp response payload.
export function buildVotingSession(data, votingToken) {
  return {
    voting_token: votingToken,
    election_id: data?.eligibility?.election_id ?? null,
    ballot: Array.isArray(data?.ballot) ? data.ballot : [],
    voter: {
      id: data?.user?.id ?? null,
      name:
        `${data?.user?.first_name ?? ""} ${data?.user?.last_name ?? ""}`.trim() ||
        data?.user?.email ||
        "",
      email: data?.user?.email ?? "",
    },
    organisation_id: data?.membership?.organisation_id ?? null,
  };
}

export function saveVotingSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getVotingSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearVotingSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

// Group a flat ballot ([{candidate_id, position_id, position_name, candidate_name,
// slogan}]) into positions with their candidates, preserving first-seen order.
export function groupBallotByPosition(ballot = []) {
  const byPosition = new Map();
  for (const item of ballot) {
    if (!byPosition.has(item.position_id)) {
      byPosition.set(item.position_id, {
        id: item.position_id,
        title: item.position_name,
        candidates: [],
      });
    }
    byPosition.get(item.position_id).candidates.push({
      id: item.candidate_id,
      name: item.candidate_name || "Unknown",
      slogan: item.slogan || "",
    });
  }
  return Array.from(byPosition.values());
}
