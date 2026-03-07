"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 15, fontWeight: 600, color: "#1e40af", margin: "0 0 18px" }}>{children}</h2>;
}

export function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#334155", marginBottom: 6 }}>
      {children}
      {required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
  );
}

export function InputField({
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 14px",
        border: "1px solid #e2e8f0",
        borderRadius: 7,
        fontSize: 13,
        color: "#0f172a",
        outline: "none",
        background: "#fff",
      }}
    />
  );
}

export function SelectField({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 34px 10px 14px",
          border: "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 13,
          color: "#0f172a",
          outline: "none",
          background: "#fff",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={15} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }} />
    </div>
  );
}

export function SearchableSelectField({
  value,
  onChange,
  options,
  placeholder = "Select...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm("");
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
        style={{
          width: "100%",
          padding: "10px 34px 10px 14px",
          border: isOpen ? "1px solid #2563eb" : "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 13,
          color: value ? "#0f172a" : "#94a3b8",
          outline: "none",
          background: "#fff",
          textAlign: "left",
          cursor: "pointer",
          minHeight: 39,
          display: "flex",
          alignItems: "center",
          boxShadow: isOpen ? "0 0 0 1px #2563eb" : "none",
          transition: "all 0.15s ease",
        }}
      >
        {value || placeholder}
        <ChevronDown
          size={15}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: `translateY(-50%) ${isOpen ? "rotate(180deg)" : ""}`,
            color: "#94a3b8",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            zIndex: 50,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={14} color="#64748b" style={{ marginLeft: 6 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#334155",
                background: "transparent",
              }}
            />
          </div>
          <div style={{ maxHeight: 200, overflowY: "auto", padding: 4 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = value === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 13,
                      border: "none",
                      background: isSelected ? "#f1f5f9" : "transparent",
                      color: isSelected ? "#0f172a" : "#475569",
                      fontWeight: isSelected ? 500 : 400,
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (!isSelected ? (e.currentTarget.style.background = "#f8fafc") : null)}
                    onMouseLeave={(e) => (!isSelected ? (e.currentTarget.style.background = "transparent") : null)}
                  >
                    {opt}
                  </button>
                );
              })
            ) : (
              <div style={{ padding: "12px", textAlign: "center", fontSize: 13, color: "#64748b" }}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function MultiSelectChips({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((opt) => {
        const isActive = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              borderRadius: 20,
              border: isActive ? "1.5px solid #2563eb" : "1px solid #e2e8f0",
              background: isActive ? "#eff6ff" : "#fff",
              color: isActive ? "#1e40af" : "#475569",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {opt}
            {isActive && <X size={12} />}
          </button>
        );
      })}
    </div>
  );
}

export function SearchableMultiSelectField({
  selected,
  onChange,
  options,
  placeholder = "Select...",
}: {
  selected: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

  const toggle = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
      return;
    }
    onChange([...selected, opt]);
  };

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSearchTerm("");
            setTimeout(() => inputRef.current?.focus(), 10);
          }
        }}
        style={{
          width: "100%",
          padding: "10px 34px 10px 14px",
          border: isOpen ? "1px solid #2563eb" : "1px solid #e2e8f0",
          borderRadius: 7,
          fontSize: 13,
          color: selected.length > 0 ? "#0f172a" : "#94a3b8",
          outline: "none",
          background: "#fff",
          textAlign: "left",
          cursor: "pointer",
          minHeight: 39,
          display: "flex",
          alignItems: "center",
          boxShadow: isOpen ? "0 0 0 1px #2563eb" : "none",
          transition: "all 0.15s ease",
        }}
      >
        {selected.length > 0 ? `${selected.length} selected` : placeholder}
        <ChevronDown
          size={15}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: `translateY(-50%) ${isOpen ? "rotate(180deg)" : ""}`,
            color: "#94a3b8",
            transition: "transform 0.2s",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            width: "100%",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 7,
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            zIndex: 50,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <Search size={14} color="#64748b" style={{ marginLeft: 6 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#334155",
                background: "transparent",
              }}
            />
          </div>
          <div style={{ maxHeight: 220, overflowY: "auto", padding: 4 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selected.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggle(opt)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      fontSize: 13,
                      border: "none",
                      background: isSelected ? "#eff6ff" : "transparent",
                      color: isSelected ? "#1e40af" : "#475569",
                      fontWeight: isSelected ? 500 : 400,
                      borderRadius: 4,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    onMouseEnter={(e) => (!isSelected ? (e.currentTarget.style.background = "#f8fafc") : null)}
                    onMouseLeave={(e) => (!isSelected ? (e.currentTarget.style.background = "transparent") : null)}
                  >
                    {opt}
                    {isSelected ? <X size={12} /> : null}
                  </button>
                );
              })
            ) : (
              <div style={{ padding: "12px", textAlign: "center", fontSize: 13, color: "#64748b" }}>No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
