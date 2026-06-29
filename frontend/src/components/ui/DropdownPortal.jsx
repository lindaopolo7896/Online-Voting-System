import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

function DropdownPortal({ items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      const insideButton = btnRef.current?.contains(e.target);
      const insideMenu = menuRef.current?.contains(e.target);
      if (!insideButton && !insideMenu) {
        setOpen(false);
      }
    }
    function handleScroll() {
      setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  function handleOpen() {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 6,
        left: rect.right - 192, // 192 = w-48
      });
    }
    setOpen((o) => !o);
  }

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-background transition"
      >
        <MoreVertical size={15} />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
            className="w-48 rounded-xl border border-border bg-surface shadow-xl overflow-hidden"
          >
            {items.map(({ label, icon: Icon, onClick, disabled, danger }) => (
              <button
                key={label}
                disabled={disabled}
                onClick={() => {
                  if (!disabled) {
                    onClick();
                    setOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition
                ${
                  disabled
                    ? "cursor-not-allowed opacity-40 text-muted"
                    : danger
                      ? "text-error hover:bg-background cursor-pointer"
                      : "text-text hover:bg-background cursor-pointer"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                {label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}

export default DropdownPortal;
