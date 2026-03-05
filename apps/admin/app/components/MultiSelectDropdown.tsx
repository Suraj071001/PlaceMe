"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder,
}: {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayText = selectedValues.length === 0 ? placeholder : selectedValues.length === 1 ? selectedValues[0] : `${selectedValues.length} selected`;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={{ fontSize: 12, color: "#64748b", marginBottom: 4, display: "block" }}>{label}</label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "#f8fafc",
          fontSize: 14,
          color: selectedValues.length > 0 ? "#1e293b" : "#64748b",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayText}</span>
        <ChevronDown size={14} style={{ color: "#94a3b8", flexShrink: 0 }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            maxHeight: 250,
            overflowY: "auto",
            padding: 4,
          }}
        >
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                padding: "8px 12px",
                fontSize: 14,
                color: "#334155",
                cursor: "pointer",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: selectedValues.includes(opt) ? "#f1f5f9" : "transparent",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f1f5f9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = selectedValues.includes(opt) ? "#f1f5f9" : "transparent")}
            >
              <span>{opt}</span>
              {selectedValues.includes(opt) && <Check size={14} color="#6366f1" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
