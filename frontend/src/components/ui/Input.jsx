export default function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-text">{label}</label>

      <input
        {...props}
        className="border border-border   
        bg-surface rounded-lg py-2 placeholder:font-normal text-text placeholder:text-muted/50  focus:border-primary focus:shadow-xl focus:shadow-primary/15 focus:outline-none px-3  w-full h-12"
      />

      {error && <span className="text-error text-sm text-error">{error}</span>}
    </div>
  );
}
