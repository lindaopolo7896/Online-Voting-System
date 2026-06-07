import { useState } from "react";
import ShowPassword from "../ShowPassword";

export default function PasswordInput({
  label,
  error,
  className = "",
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-text">{label}</label>

      <div className="relative w-full">
        <input
          type={show ? "text" : "password"}
          {...props}
          className={`border border-border bg-surface rounded-lg py-2 px-3 w-full h-12 text-text placeholder:text-muted/50 focus:border-primary focus:shadow-xl focus:shadow-primary/15 focus:outline-none ${className}`}
        />

        <ShowPassword show={show} setShow={setShow} />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
