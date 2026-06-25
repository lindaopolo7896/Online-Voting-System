import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, Upload, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { createMembership } from "../../api/organisationApi";
import useAuth from "../../hooks/useAuth";

const REQUIRED_HEADERS = ["first_name", "last_name", "email", "password", "role"];

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
  return { headers, rows };
}

function BulkUploadMembersModal({ onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [headerError, setHeaderError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null); // { created, failed: [{row, reason}] }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResults(null);
    setHeaderError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      const { headers, rows: parsed } = parseCSV(ev.target.result);
      const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length) {
        setHeaderError(`Missing columns: ${missing.join(", ")}`);
        setRows([]);
      } else {
        setHeaderError("");
        setRows(parsed);
      }
    };
    reader.readAsText(f);
  }

  async function handleUpload() {
    if (!rows.length) return;
    setProcessing(true);
    let created = 0;
    const failed = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        await createMembership({
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email.toLowerCase(),
          password: row.password,
          role: row.role || "participant",
          organisation_id: user?.organisationId,
          ...(row.phone && { phone: row.phone }),
          ...(row.bio && { bio: row.bio }),
        });
        created++;
      } catch (err) {
        const data = err?.response?.data;
        const reason =
          data?.detail ||
          data?.email?.[0] ||
          data?.message ||
          "Unknown error";
        failed.push({ row: i + 2, email: row.email, reason });
      }
    }

    setProcessing(false);
    setResults({ created, failed });

    if (created > 0) {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success(`${created} member${created !== 1 ? "s" : ""} added.`);
    }
    if (failed.length) {
      toast.error(`${failed.length} row${failed.length !== 1 ? "s" : ""} failed.`);
    }
  }

  const canUpload = rows.length > 0 && !headerError && !processing && !results;

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
            <p className="text-xs text-muted">Bulk add members via CSV</p>
          </div>
        </div>

        {/* Template hint */}
        <div className="mb-4 rounded-lg bg-primary/5 border border-primary/20 px-4 py-3 text-xs text-muted">
          Required columns:&nbsp;
          <span className="font-mono text-primary">
            first_name, last_name, email, password, role
          </span>
          <br />
          Optional:&nbsp;
          <span className="font-mono text-primary">phone, bio</span>
        </div>

        {/* File picker */}
        {!file ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 transition text-muted hover:text-primary"
          >
            <FileText size={28} />
            <span className="text-sm">Click to select CSV file</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
            <FileText size={18} className="text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-text">{file.name}</p>
              {!headerError && !results && (
                <p className="text-xs text-muted">{rows.length} row{rows.length !== 1 ? "s" : ""} detected</p>
              )}
            </div>
            {!processing && !results && (
              <button
                onClick={() => { setFile(null); setRows([]); setHeaderError(""); if (fileRef.current) fileRef.current.value = ""; }}
                className="text-muted hover:text-error transition"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />

        {headerError && (
          <p className="mt-3 text-xs text-error">{headerError}</p>
        )}

        {/* Results */}
        {results && (
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>{results.created} member{results.created !== 1 ? "s" : ""} created successfully</span>
            </div>
            {results.failed.length > 0 && (
              <div className="rounded-lg border border-error/30 bg-error/5 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-error">
                  <XCircle size={14} /> {results.failed.length} failed
                </p>
                <ul className="space-y-1">
                  {results.failed.map((f) => (
                    <li key={f.row} className="text-xs text-muted">
                      Row {f.row} ({f.email}): {f.reason}
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
              onClick={handleUpload}
              disabled={!canUpload}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing && <Loader2 size={14} className="animate-spin" />}
              {processing ? "Uploading…" : `Upload ${rows.length} Member${rows.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkUploadMembersModal;
