function Card({ children, className }) {
  return (
    <div
      className={`bg-surface w-full border border-border shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
