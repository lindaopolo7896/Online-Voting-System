import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Award, ImagePlus } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import useDashboard from "@/hooks/useDashboard";
import useAuth from "@/hooks/useAuth";
import {
  getElections,
  getElectionCandidates,
  updateCandidateProfile,
  updateUser,
} from "@/api/organisationApi";

// ── Personal details (first/last name live on the User) ─────────────────────
function PersonalDetailsCard({ userId, firstName, lastName }) {
  const queryClient = useQueryClient();
  const [first, setFirst] = useState(firstName ?? "");
  const [last, setLast] = useState(lastName ?? "");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateUser(userId, { first_name: first.trim(), last_name: last.trim() }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["elections"] });
      toast.success("Personal details updated.");
    },
    onError: (err) =>
      toast.error(
        err?.response?.data?.detail || "Failed to update personal details.",
      ),
  });

  const dirty = first !== (firstName ?? "") || last !== (lastName ?? "");

  return (
    <Card className="border-white/10 rounded-2xl p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-text font-bold text-lg">Personal Details</h2>
        <p className="text-muted text-sm mt-0.5">
          Shown to voters across every election you stand in.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={first}
          onChange={(e) => setFirst(e.target.value)}
          placeholder="First name"
        />
        <Input
          label="Last Name"
          value={last}
          onChange={(e) => setLast(e.target.value)}
          placeholder="Last name"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => mutate()}
          disabled={!dirty || isPending}
          className="rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </Card>
  );
}

// ── One candidacy (campaign profile for a specific election/position) ────────
function CandidacyCard({ election, candidate }) {
  const queryClient = useQueryClient();
  const [slogan, setSlogan] = useState(candidate.slogan ?? "");
  const [manifesto, setManifesto] = useState(candidate.manifesto ?? "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(candidate.campaign_photos ?? "");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      updateCandidateProfile(election.id, candidate.id, {
        slogan: slogan.trim(),
        manifesto: manifesto.trim(),
        campaign_photos: photoFile ?? undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["election-candidates", election.id] });
      setPhotoFile(null);
      toast.success("Campaign profile updated.");
    },
    onError: (err) =>
      toast.error(
        err?.response?.data?.detail || "Failed to update campaign profile.",
      ),
  });

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const dirty =
    slogan !== (candidate.slogan ?? "") ||
    manifesto !== (candidate.manifesto ?? "") ||
    photoFile != null;

  return (
    <Card className="border-white/10 rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-text font-bold text-lg">{election.name}</h2>
          <p className="text-muted text-sm mt-0.5">
            Running for{" "}
            <span className="text-primary font-medium">
              {candidate.position?.name ?? "—"}
            </span>
          </p>
        </div>
        <span className="shrink-0 rounded border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-semibold capitalize text-muted">
          {candidate.status ?? "active"}
        </span>
      </div>

      <div className="flex gap-5 flex-col sm:flex-row">
        {/* Campaign photo */}
        <div className="flex flex-col gap-2 items-center">
          <div className="h-28 w-28 rounded-xl overflow-hidden border border-border bg-background flex items-center justify-center shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="campaign"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus size={26} className="text-muted" />
            )}
          </div>
          <label className="cursor-pointer text-xs text-primary hover:underline">
            {photoPreview ? "Change photo" : "Upload photo"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />
          </label>
        </div>

        {/* Slogan + manifesto */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Input
            label="Slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            placeholder="A short, memorable campaign slogan"
          />
          <div className="flex flex-col gap-2">
            <label className="text-text font-medium">Manifesto</label>
            <textarea
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              rows={5}
              placeholder="What will you do if elected?"
              className="border border-border bg-surface rounded-lg py-2 px-3 text-text placeholder:text-muted/50 focus:border-primary focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => mutate()}
          disabled={!dirty || isPending}
          className="rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : "Save Campaign Profile"}
        </button>
      </div>
    </Card>
  );
}

function VoterCandidacyPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  const { user } = useAuth();
  useEffect(() => {
    setPageTitle("My Candidacy");
    setSubtitle("Manage your campaign profile");
  }, [setPageTitle, setSubtitle]);

  const { data: elections = [], isLoading: electionsLoading } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  const candidateQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["election-candidates", e.id],
      queryFn: () => getElectionCandidates(e.id),
    })),
  });

  // Candidacies belonging to the logged-in user, across their elections.
  const myCandidacies = useMemo(() => {
    const out = [];
    elections.forEach((e, i) => {
      const cands = candidateQueries[i]?.data ?? [];
      for (const c of cands) {
        if (c.membership?.user?.id === user?.id) {
          out.push({ election: e, candidate: c });
        }
      }
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elections, candidateQueries.map((q) => q.dataUpdatedAt).join(","), user?.id]);

  const candidateUser = myCandidacies[0]?.candidate?.membership?.user ?? null;

  const loading =
    electionsLoading || candidateQueries.some((q) => q.isLoading);

  if (loading) {
    return <div className="p-6 text-muted text-sm">Loading your candidacy…</div>;
  }

  if (myCandidacies.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Award className="text-primary" size={26} />
        </div>
        <div>
          <p className="text-text font-semibold">You're not a candidate yet</p>
          <p className="text-muted text-sm mt-1">
            When an election official registers you as a candidate, your campaign
            profile will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-3xl">
      {candidateUser && (
        <PersonalDetailsCard
          userId={candidateUser.id}
          firstName={candidateUser.first_name}
          lastName={candidateUser.last_name}
        />
      )}

      {myCandidacies.map(({ election, candidate }) => (
        <CandidacyCard
          key={candidate.id}
          election={election}
          candidate={candidate}
        />
      ))}
    </div>
  );
}

export default VoterCandidacyPage;
