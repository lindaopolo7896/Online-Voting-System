import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { bulkUploadMembers } from "../../api/organisationApi";
import useAuth from "../../hooks/useAuth";

function BulkUploadMembersModal({ onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => bulkUploadMembers(file, user?.organisationId),
    onSuccess: (data) => {
      setResults(data);
      const created = data?.created_memberships ?? 0;
      if (created > 0) {
        queryClient.invalidateQueries({ queryKey: ["memberships"] });
        toast.success(`${created} member${created !== 1 ? "s" : ""} added.`);
      }
      const skipped = data?.skipped_rows?.length ?? 0;
      if (skipped) {
        toast.error(`${skipped} row${skipped !== 1 ? "s" : ""} skipped.`);
      }
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || "Upload failed. Please try again.";
      toast.error(msg);
    },
  });

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResults(null);
  }

  function clearFile() {
    setFile(null);
    setResults(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  const canUpload = !!file && !isPending && !results;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-text transition">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">Upload Members</h2>
            <p className="text-xs text-muted">Bulk add members via CSV or Excel</p>
          </div>
        </div>

        {/* Template hint */}
        <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-xs text-muted">
          Required column:&nbsp;
          <span className="font-mono text-primary">email</span>
          <br />
          Optional:&nbsp;
          <span className="font-mono text-primary">
            first_name, last_name, role, phone, bio
          </span>
          <br />
          <span className="text-[11px]">Roles: admin, official, member (defaults to member).</span>
        </div>

        {/* File picker */}
        {!file ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition text-muted hover:text-primary"
          >
            <FileText size={28} />
            <span className="text-sm">Click to select a CSV or Excel file</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <FileText size={18} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text">{file.name}</p>
            </div>
            {!isPending && !results && (
              <button onClick={clearFile} className="text-muted hover:text-error transition">
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xlsm,.xltx,.xltm"
          onChange={handleFile}
          className="hidden"
        />

        {/* Results */}
        {results && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>
                {results.created_memberships ?? 0} added
                {results.updated_memberships ? `, ${results.updated_memberships} updated` : ""}
                {results.existing_memberships ? `, ${results.existing_memberships} already existed` : ""}
              </span>
            </div>
            {results.created_users > 0 && (
              <p className="text-xs text-muted">{results.created_users} new user account(s) created.</p>
            )}
            {results.skipped_rows?.length > 0 && (
              <div className="rounded-lg border border-error/30 bg-error/5 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-error">
                  <XCircle size={14} /> {results.skipped_rows.length} skipped
                </p>
                <ul className="space-y-1">
                  {results.skipped_rows.map((f, i) => (
                    <li key={i} className="text-xs text-muted">
                      Row {f.row}: {f.reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition">
            {results ? "Close" : "Cancel"}
          </button>
          {!results && (
            <button
              onClick={() => mutate()}
              disabled={!canUpload}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {isPending ? "Uploading…" : "Upload"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkUploadMembersModal;
