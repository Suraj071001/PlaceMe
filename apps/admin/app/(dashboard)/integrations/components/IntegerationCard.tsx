"use client";

import { useState } from "react";
import { MessageSquare, Users, Settings } from "lucide-react";
import { Integration } from "./data";

import { Button } from "@repo/ui/components/button";
import SpacesDialog from "./SpaceDialog";
import ConfigureSpaceDialog from "./ConfigDialog";

type Props = {
  integration: Integration;
};

export default function IntegrationCard({ integration }: Props) {
  const Icon = integration.id === "google-chat" ? MessageSquare : Users;

  const [spacesOpen, setSpacesOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const openConfigDialog = () => {
    setSpacesOpen(false);

    setTimeout(() => {
      setConfigOpen(true);
    }, 150);
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

        <hr className="my-4" />

        {/* Configure Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setSpacesOpen(true)}>
            <Settings size={16} />
            Configure
          </Button>
        </div>
      </div>

      {/* Spaces Dialog */}
      <SpacesDialog open={spacesOpen} onOpenChange={setSpacesOpen} onAddSpace={openConfigDialog} />

      {/* Configure Dialog */}
      <ConfigureSpaceDialog open={configOpen} onOpenChange={setConfigOpen} />
    </>
  );
}
