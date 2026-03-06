export default function ActionBtn({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#fff",
        color: "#1e293b",
        border: "1px solid #d1d5db",
        borderRadius: 7,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
      }}
    >
      {icon} {label}
    </button>
  );
}
