import React from "react";

interface StatusBadgeProps {
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, { bg: string; color: string; border: string }> =
    {
      pending: { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
      confirmed: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe" },
      shipped: { bg: "#fef3c7", color: "#92400e", border: "#fcd34d" },
      delivered: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
      cancelled: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
    };

  const c = colors[status] || colors.pending;

  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        border: `1px solid ${c.border}`,
        padding: "2px 10px",
        borderRadius: 10,
        fontSize: 11,
        fontWeight: 600,
        textTransform: "capitalize",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

interface SourceBadgeProps {
  source: "website" | "whatsapp" | "instagram" | "facebook";
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const icons: Record<string, string> = {
    website: "🌐",
    whatsapp: "💬",
    instagram: "📸",
    facebook: "📘",
  };

  return (
    <span
      style={{
        background: "#f5f5f5",
        padding: "2px 8px",
        borderRadius: 8,
        fontSize: 11,
        whiteSpace: "nowrap",
      }}
    >
      {icons[source]} {source}
    </span>
  );
}
