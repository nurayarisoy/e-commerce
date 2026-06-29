"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/uiStore";

export default function Toasts() {
  const toasts = useUIStore((s) => s.toasts);
  const remove = useUIStore((s) => s.removeToast);

  useEffect(() => {
    // ensure portal root exists
    let root = document.getElementById("__toasts_root");
    if (!root) {
      root = document.createElement("div");
      root.id = "__toasts_root";
      document.body.appendChild(root);
    }
  }, []);

  if (typeof window === "undefined") return null;

  const root = document.getElementById("__toasts_root");
  if (!root) return null;

  return createPortal(
    <div className="fixed z-50 top-6 right-6 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => remove(t.id)} />
      ))}
    </div>,
    root
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    const id = setTimeout(() => onClose(), toast.duration || 2200);
    return () => clearTimeout(id);
  }, [toast, onClose]);

  const handleUndo = () => {
    try {
      if (typeof toast.undo === "function") {
        toast.undo();
      }
    } catch (err) {
      // ignore undo errors
    }
    onClose();
  };

  return (
    <div className="max-w-xs bg-black text-white px-3 py-2 rounded shadow-lg opacity-95 animate-toast-in flex items-start gap-3">
      <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 7l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 17l7-5 7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex-1">
        <div className="text-sm">{toast.message}</div>
        {toast.undo && (
          <button
            onClick={handleUndo}
            className="mt-1 text-xs text-blue-200 hover:text-white"
            aria-label="Geri al"
          >
            Geri al
          </button>
        )}
      </div>
    </div>
  );
}
