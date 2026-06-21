export default function Button({ name, className = "", disabled }) {
  return (
    <button
      type="submit"
      className={`w-full h-12 bg-primary rounded-md text-xl font-semibold text-white hover:bg-primary/80 transition-all duration-300 ease-in-out cursor-pointer  shadow-[0_0_25px_rgba(37,99,235,0.45)] ${className}`}
      disabled={disabled}
    >
      {name}
    </button>
  );
}
