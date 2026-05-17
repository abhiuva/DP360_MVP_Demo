import React, { useEffect, useRef } from "react";

/**
 * Polished modal:
 * - Centered, compact header, subtle scale/opacity animation
 * - Backdrop blur + scroll lock
 * - Sizes: sm/md/lg, Heights: short/normal/tall
 * - position: "center" | "top"
 *
 * Props:
 *  - title, onClose, children
 *  - size: "sm" | "md" | "lg"  (default "md")
 *  - height: "short" | "normal" | "tall"  (default "normal")
 *  - headerCompact: boolean (default true)
 *  - position: "center" | "top" (default "center")
 *  - wide: boolean (deprecated; maps to size="lg")
 */
const Modal = ({
  title,
  onClose,
  children,
  size = "md",
  height = "normal",
  headerCompact = true,
  position = "center",
  wide = false,
}) => {
  const dialogRef = useRef(null);

  // Back-compat
  const effectiveSize = wide ? "lg" : size;

  // Lock background scroll
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Initial focus
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const maxWidth = { sm: 520, md: 720, lg: 960 }[effectiveSize] || 720;
  const maxHeight = { short: "65vh", normal: "80vh", tall: "90vh" }[height] || "80vh";
  const alignClass = position === "top" ? "align-items-start" : "align-items-center";
  const paddingTop = position === "top" ? "4vh" : 0;

  return (
    <div
      className={`position-fixed top-0 start-0 w-100 h-100 d-flex ${alignClass} justify-content-center`}
      style={{
        background: "rgba(17,18,20,0.45)",
        backdropFilter: "blur(3px)",
        zIndex: 1050,
        paddingTop,
        animation: "modalFade 150ms ease-out",
      }}
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}            // click backdrop closes
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onScroll={(e) => e.stopPropagation()}
    >
      <style>{`
        @keyframes modalGrow {
          from { transform: translateY(4px) scale(.98); opacity: 0; }
          to   { transform: translateY(0)   scale(1);    opacity: 1; }
        }
        @keyframes modalFade {
          from { opacity: .5; } to { opacity: 1; }
        }
      `}</style>

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-4 shadow"
        style={{
          width: "95%",
          maxWidth: `${maxWidth}px`,
          maxHeight,
          overflow: "auto",
          boxShadow: "0 12px 34px rgba(0,0,0,0.25)",
          animation: "modalGrow 160ms ease-out",
        }}
        onMouseDown={(e) => e.stopPropagation()}   // prevent backdrop close
      >
        <div className={`d-flex align-items-center justify-content-between border-bottom ${headerCompact ? "px-3 py-2" : "px-4 py-3"}`}>
          <h6 className={`m-0 ${headerCompact ? "" : "fs-5"}`}>{title}</h6>
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>

        <div className={headerCompact ? "p-3" : "p-4"}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
export { Modal };
