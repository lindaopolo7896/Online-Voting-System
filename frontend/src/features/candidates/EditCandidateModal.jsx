import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, UserCheck, ImagePlus, Trash2 } from "lucide-react";
import apiClient from "../../services/apiClient";

const STATUS_OPTIONS = ["active", "withdrawn", "disqualified"];
const BASE_URL = "http://127.0.0.1:8000";

function nameFromEmail(email) {
  const local = email.split("@")[0] ?? "";
  return local
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

function candidateDisplayName(c) {
  const u = c.membership?.user ?? {};
  const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
  if (full) return full;
  if (u.email) return nameFromEmail(u.email);
  return `Candidate #${c.id}`;
}

function EditCandidateModal({ electionId, candidate, onClose }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const [slogan, setSlogan] = useState(candidate.slogan ?? "");
  const [manifesto, setManifesto] = useState(candidate.manifesto ?? "");
  const [status, setStatus] = useState(candidate.status ?? "active");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload) => {
      const form = new FormData();
      form.append("slogan", payload.slogan ?? "");
      form.append("manifesto", payload.manifesto ?? "");
      form.append("status", payload.status);
      if (payload.photo) {
        form.append("campaign_photos", payload.photo);
      }
      // Clear Content-Type so the browser sets the multipart boundary automatically
      const { data } = await apiClient.patch(
        `/elections/${electionId}/candidates/${candidate.id}/`,
        form,
        { headers: { "Content-Type": undefined } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates", electionId] });
      toast.success("Candidate updated.");
      onClose();
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg =
        data?.detail ||
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Failed to update candidate.";
      toast.error(msg);
    },
  });

  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function handleRemovePhoto() {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate({
      slogan: slogan || null,
      manifesto: manifesto || null,
      status,
      photo: photoFile ?? undefined,
    });
  }

  const name = candidateDisplayName(candidate);
  const u = candidate.membership?.user ?? {};
  const email = u.email ?? "";
  const existingPhoto = candidate.campaign_photos
    ? candidate.campaign_photos.startsWith("http")
      ? candidate.campaign_photos
      : `${BASE_URL}${candidate.campaign_photos}`
    : null;
  const displayPhoto = photoPreview ?? existingPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-text transition"
        >
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">Edit Candidate</h2>
            <p className="text-xs text-muted">Update candidate profile details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name — read only */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Name</label>
            <input
              type="text"
              readOnly
              value={name}
              className="rounded-lg border border-border bg-background/50 px-3 py-2.5 text-sm text-muted cursor-not-allowed"
            />
            {email && (
              <p className="text-xs text-muted">{email}</p>
            )}
          </div>

          {/* Slogan */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">
              Slogan
              <span className="ml-1 text-xs text-muted font-normal">(max 100 chars)</span>
            </label>
            <input
              type="text"
              maxLength={100}
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="Enter candidate slogan"
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
            />
            <p className="text-right text-xs text-muted">{slogan.length}/100</p>
          </div>

          {/* Manifesto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Manifesto</label>
            <textarea
              rows={4}
              value={manifesto}
              onChange={(e) => setManifesto(e.target.value)}
              placeholder="Enter candidate manifesto"
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign Photo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text">Campaign Photo</label>

            {displayPhoto ? (
              <div className="relative w-full overflow-hidden rounded-xl border border-border">
                <img
                  src={displayPhoto}
                  alt="Campaign"
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-600 transition"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition text-muted hover:text-primary"
              >
                <ImagePlus size={24} />
                <span className="text-xs">Click to upload photo</span>
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {photoFile && (
              <p className="text-xs text-muted truncate">{photoFile.name}</p>
            )}

            {!displayPhoto && (
              <p className="text-xs text-muted">
                Accepted formats: JPG, PNG, WEBP
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCandidateModal;
