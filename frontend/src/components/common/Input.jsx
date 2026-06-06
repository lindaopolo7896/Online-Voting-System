export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>

      <input {...props} className="border border-border rounded-md px-3 py-2" />

      {error && <span className="text-error text-sm text-error">{error}</span>}
    </div>
  );
}
