"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Users, Settings } from "lucide-react";
import { Integration } from "./data";

import { Button } from "@repo/ui/components/button";
import SpacesDialog from "./SpaceDialog";
import ConfigureSpaceDialog from "./ConfigDialog";
import { API_BASE, getAuthHeaders } from "../../../lib/api";

type Props = {
  integration: Integration;
};

type Space = {
  id: string;
  name: string;
  active?: boolean;
};

export default function IntegrationCard({ integration }: Props) {
  const Icon = integration.id === "google-chat" ? MessageSquare : Users;
  const itemLabel = integration.id === "google-chat" ? "Space" : "Channel";

  const [spacesOpen, setSpacesOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [spacesError, setSpacesError] = useState<string | null>(null);

  const loadGoogleChatSpaces = async () => {
    if (integration.id !== "google-chat") return;
    setLoadingSpaces(true);
    setSpacesError(null);
    try {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        setSpaces([]);
        setSpacesError("Login required to fetch spaces.");
        return;
      }

      const res = await fetch(`${API_BASE}/integration/google-chat/spaces`, {
        headers,
      });

      if (!res.ok) {
        setSpaces([]);
        setSpacesError(res.status === 401 ? "Session expired. Please login again." : "Failed to fetch spaces.");
        return;
      }

      const body = await res.json();
      const data = Array.isArray(body?.data) ? (body.data as Space[]) : [];
      setSpaces(data);
    } catch {
      setSpaces([]);
      setSpacesError("Failed to fetch spaces.");
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    loadGoogleChatSpaces();
  }, [integration.id]);

  const openConfigDialog = (space: string) => {
    setSelectedSpace(space);
    setSpacesOpen(false);

    setTimeout(() => {
      setConfigOpen(true);
    }, 200);
  };

  return (
    <>
      <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col justify-between h-full">
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

        <hr className="my-4" />

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={async () => {
              await loadGoogleChatSpaces();
              setSpacesOpen(true);
            }}
          >
            <Settings size={16} />
            Configure
          </Button>
        </div>
      </div>

      <SpacesDialog
        open={spacesOpen}
        onOpenChange={setSpacesOpen}
        spaces={spaces}
        loading={loadingSpaces}
        error={spacesError}
        onSelectSpace={openConfigDialog}
        integrationName={integration.name}
        itemLabel={itemLabel}
      />

      <ConfigureSpaceDialog open={configOpen} onOpenChange={setConfigOpen} spaceName={selectedSpace} integrationName={integration.name} itemLabel={itemLabel} />
    </>
  );
}
