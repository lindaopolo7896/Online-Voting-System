import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Upload, X, FileSpreadsheet } from "lucide-react";
import Card from "@/components/ui/Card";
import { getMemberships } from "@/features/permissions/api";

const ROLE_BADGE = {
  admin: "bg-purple-500/12 text-purple-400",
  official: "bg-blue-500/12 text-blue-400",
  member: "bg-green-500/12 text-green-400",
};

const SUPPORTED_FIELDS = [
  { name: "email", required: true, note: "Must be a valid email address" },
  { name: "first_name", required: false, note: "Participant's first name" },
  { name: "last_name", required: false, note: "Participant's last name" },
  { name: "phone", required: false, note: "Phone number" },
  { name: "bio", required: false, note: "Short bio" },
  {
    name: "role",
    required: false,
    note: "admin | official | member (defaults to member)",
  },
];

function ParticipantsStep({
  selectedMemberIds,
  setSelectedMemberIds,
  participantsFile,
  setParticipantsFile,
  onBack,
  onNext,
  isCreating,
}) {
  const [mode, setMode] = useState("select");
  const [search, setSearch] = useState("");
  const fileInputRef = useRef(null);

  const {
    data: members = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["memberships"],
    queryFn: getMemberships,
  });

  const filtered = members.filter((m) => {
    const fullName =
      `${m.user?.first_name ?? ""} ${m.user?.last_name ?? ""}`.toLowerCase();
    const email = (m.user?.email ?? "").toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || email.includes(q);
  });

  function toggle(id) {
    setSelectedMemberIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelectedMemberIds(new Set(filtered.map((m) => m.id)));
  }

  function deselectAll() {
    setSelectedMemberIds(new Set());
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] ?? null;
    setParticipantsFile(file);
    e.target.value = "";
  }

  function removeFile() {
    setParticipantsFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">Participants</h2>
        <p className="mt-1 text-sm text-muted">
          Select existing org members or upload a CSV/XLSX to add voters and
          candidates in one go.
        </p>
        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted">
          <span className="font-semibold text-text">Tip:</span> Everyone you add
          becomes a participant (voter). The optional{" "}
          <span className="font-mono text-primary">role</span> column sets their
          organisation role (<span className="font-mono text-primary">member</span>,{" "}
          <span className="font-mono text-primary">official</span>, or{" "}
          <span className="font-mono text-primary">admin</span>). You can register
          any participant as a candidate for a position from the next step or the
          Candidates page.
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-6 border-b border-border">
        <button
          onClick={() => setMode("select")}
          className={`pb-3 text-sm font-medium transition-colors ${
            mode === "select"
              ? "border-b-2 border-primary text-primary"
              : "text-muted hover:text-text"
          }`}
        >
          Select Members
        </button>
        <button
          onClick={() => setMode("upload")}
          className={`pb-3 text-sm font-medium transition-colors ${
            mode === "upload"
              ? "border-b-2 border-primary text-primary"
              : "text-muted hover:text-text"
          }`}
        >
          Upload File
        </button>
      </div>

      {/* ── Select Members tab ── */}
      {mode === "select" && (
        <>
          {/* Search + bulk actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface text-text placeholder:text-muted/50 focus:outline-none focus:border-primary text-sm"
              />
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={selectAll}
                className="px-3 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary/8 transition"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="px-3 py-2 text-sm rounded-lg border border-border text-muted hover:bg-background transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Selected count */}
          <p className="text-xs text-muted mb-3">
            {selectedMemberIds.size} member
            {selectedMemberIds.size !== 1 ? "s" : ""} selected
          </p>

          {/* Member list */}
          <div className="border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <p className="text-muted text-sm p-5">Loading members...</p>
            ) : isError ? (
              <p className="text-error text-sm p-5">
                Failed to load members. Please refresh.
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-muted text-sm p-5">
                {search
                  ? "No members match your search."
                  : "No members found in this organisation."}
              </p>
            ) : (() => {
                const allSelected =
                  filtered.length > 0 &&
                  filtered.every((m) => selectedMemberIds.has(m.id));
                const someSelected = filtered.some((m) =>
                  selectedMemberIds.has(m.id),
                );
                return (
                  <>
                    {/* Select-all header row */}
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-background border-b border-border sticky top-0">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => {
                          if (el)
                            el.indeterminate = someSelected && !allSelected;
                        }}
                        onChange={() =>
                          allSelected ? deselectAll() : selectAll()
                        }
                        className="w-4 h-4 accent-primary shrink-0 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-muted uppercase flex-1">
                        {allSelected
                          ? "Deselect all"
                          : someSelected
                            ? `${selectedMemberIds.size} selected — select all`
                            : `Select all ${filtered.length} members`}
                      </span>
                      <span className="text-xs font-semibold text-muted uppercase shrink-0">
                        Role
                      </span>
                    </div>

                    <ul className="divide-y divide-border max-h-80 overflow-y-auto">
                      {filtered.map((m) => {
                        const isSelected = selectedMemberIds.has(m.id);
                        const fullName =
                          `${m.user?.first_name ?? ""} ${m.user?.last_name ?? ""}`.trim() ||
                          "Unknown";
                        return (
                          <li
                            key={m.id}
                            onClick={() => toggle(m.id)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                              isSelected ? "bg-primary/8" : "hover:bg-background"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggle(m.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-4 h-4 accent-primary shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-text text-sm font-medium truncate">
                                {fullName}
                              </p>
                              <p className="text-muted text-xs truncate">
                                {m.user?.email}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium capitalize ${
                                ROLE_BADGE[m.role] ?? "bg-white/10 text-muted"
                              }`}
                            >
                              {m.role}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                );
              })()
            }
          </div>
        </>
      )}

      {/* ── Upload File tab ── */}
      {mode === "upload" && (
        <div className="space-y-5">
          {/* Drop zone / file picker */}
          {participantsFile ? (
            <div className="flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
              <FileSpreadsheet size={32} className="text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-text text-sm font-medium truncate">
                  {participantsFile.name}
                </p>
                <p className="text-muted text-xs">
                  {(participantsFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={removeFile}
                className="text-muted hover:text-error transition-colors shrink-0"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Upload size={22} className="text-primary" />
              </div>
              <h3 className="font-semibold text-text">Upload Participants File</h3>
              <p className="mt-2 text-sm text-muted">
                Upload a CSV or Excel file with participant details
              </p>
              <span className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm text-white">
                Choose File
              </span>
              <p className="mt-3 text-xs text-muted">
                Supported formats: .csv, .xlsx
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xlsm"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}

          {/* Supported fields table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="bg-surface px-4 py-3 border-b border-border">
              <h4 className="text-sm font-semibold text-text">Supported Fields</h4>
              <p className="text-xs text-muted mt-0.5">
                First row must be a header row with these column names.
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-background text-xs text-muted uppercase">
                  <th className="text-left px-4 py-2">Column Name</th>
                  <th className="text-left px-4 py-2">Required</th>
                  <th className="text-left px-4 py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SUPPORTED_FIELDS.map((f) => (
                  <tr key={f.name}>
                    <td className="px-4 py-2.5 font-mono text-xs text-primary">
                      {f.name}
                    </td>
                    <td className="px-4 py-2.5">
                      {f.required ? (
                        <span className="text-xs font-semibold text-error">Yes</span>
                      ) : (
                        <span className="text-xs text-muted">No</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-border px-6 py-2 text-text text-sm hover:bg-background transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={isCreating}
          className="rounded-lg bg-primary px-6 py-2 text-white text-sm hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating Election…" : "Save & Continue"}
        </button>
      </div>
    </Card>
  );
}

export default ParticipantsStep;
