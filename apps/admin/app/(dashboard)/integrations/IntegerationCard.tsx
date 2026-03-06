"use client";

import { useState } from "react";
import { MessageSquare, Users, Settings } from "lucide-react";
import { Integration } from "../../components/data";

type Props = {
  integration: Integration;
};

export default function IntegrationCard({ integration }: Props) {
  const Icon = integration.id === "google-chat" ? MessageSquare : Users;

  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<"connect" | "disconnect" | null>(null);

  const handleAction = (type: "connect" | "disconnect") => {
    setAction(type);
    setOpen(true);
  };

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Icon className="w-7 h-7 text-indigo-600 mt-1" />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{integration.name}</h3>

              {integration.connected && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Connected</span>}
            </div>

            <p className="text-sm text-gray-600 max-w-md">{integration.description}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">{integration.category}</span>

          {integration.lastSync && <span>Last sync: {integration.lastSync}</span>}
        </div>

        <hr className="my-4" />

        {/* Actions Row */}
        <div className="flex items-center justify-between">
          {/* Toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" defaultChecked={integration.connected} className="accent-indigo-600" />
            Active
          </label>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100">
              <Settings size={16} />
              Configure
            </button>

            {integration.connected ? (
              <button onClick={() => handleAction("disconnect")} className="text-red-500 text-sm hover:underline">
                Disconnect
              </button>
            ) : (
              <button onClick={() => handleAction("connect")} className="text-blue-600 text-sm hover:underline">
                Connect
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{action === "connect" ? "Connect Integration" : "Disconnect Integration"}</h3>

            <p className="text-sm text-gray-600 mb-6">
              {action === "connect" ? `Are you sure you want to connect ${integration.name}?` : `Are you sure you want to disconnect ${integration.name}?`}
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
                Cancel
              </button>

              <button
                onClick={() => setOpen(false)}
                className={`px-4 py-2 text-sm rounded-md text-white ${action === "connect" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
