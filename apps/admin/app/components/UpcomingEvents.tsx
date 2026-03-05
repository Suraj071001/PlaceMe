"use client";

import { upcomingEvents, type EventItem } from "./data";
import { useState } from "react";

export function UpcomingEvents() {
  // We'll build a simple static calendar for March (31 days)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOfWeek = 0; // Assuming March 1st is a Sunday for this demo layout

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const upcomingDates = upcomingEvents.map((e) => parseInt(e.date, 10));

  const filteredEvents = selectedDate ? upcomingEvents.filter((e) => e.date === selectedDate) : upcomingEvents;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {/* Left Card: Calendar */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Calendar (March)</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center", marginBottom: 8 }}>
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {daysInMonth.map((day) => {
            const hasEvent = upcomingDates.includes(day);
            const isSelected = selectedDate === day.toString();

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : day.toString())}
                style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: hasEvent || isSelected ? 600 : 400,
                  cursor: "pointer",
                  border: isSelected ? "2px solid #6366f1" : "2px solid transparent",
                  background: isSelected ? "#e0e7ff" : hasEvent ? "#ede9fe" : "transparent",
                  color: isSelected ? "#4f46e5" : hasEvent ? "#6366f1" : "#334155",
                  transition: "all 0.2s",
                }}
              >
                {day}
                {hasEvent && !isSelected && (
                  <div style={{ position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: "50%", background: "#6366f1" }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Card: List */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>{selectedDate ? `Events on March ${selectedDate}` : "Upcoming Events"}</h3>
          <button
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
          >
            🔔 Manage
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "250px", overflowY: "auto", paddingRight: 8 }}>
          {filteredEvents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0", color: "#64748b", fontSize: 14 }}>No events on this date</div>
          ) : (
            filteredEvents.map((event: EventItem, idx: number) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 12px",
                  background: "#f8fafc",
                  borderRadius: 10,
                  border: "1px solid #f1f5f9",
                }}
              >
                <div style={{ textAlign: "center", minWidth: 45, flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#6366f1" }}>{event.date}</div>
                  <div style={{ fontSize: 10, color: "#6366f1", fontWeight: 500 }}>{event.month}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{event.title}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    🕐 {event.time} &nbsp; {event.dept}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: 12,
                    background: event.tag === "Drive" ? "#ede9fe" : event.tag === "Workshop" ? "#dcfce7" : "#fff7ed",
                    color: event.tag === "Drive" ? "#6366f1" : event.tag === "Workshop" ? "#22c55e" : "#f97316",
                  }}
                >
                  {event.tag}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
