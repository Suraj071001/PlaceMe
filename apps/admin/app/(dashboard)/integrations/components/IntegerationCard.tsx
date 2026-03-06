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
  const itemLabel = integration.id === "google-chat" ? "Space" : "Channel";

  const [spacesOpen, setSpacesOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  // mock spaces for frontend
  const [spaces] = useState([
    { id: "space1", name: "Placement Updates", active: true },
    { id: "space2", name: "Internship Notifications", active: false },
    { id: "space3", name: "Drive Announcements", active: true },
    { id: "space4", name: "Placement Updates", active: true },
    { id: "space5", name: "Internship Notifications", active: false },
    { id: "space6", name: "Drive Announcements", active: true },
    { id: "space7", name: "Placement Updates", active: true },
    { id: "space8", name: "Internship Notifications", active: false },
    { id: "space9", name: "Drive Announcements", active: true },
    { id: "space10", name: "Placement Updates", active: true },
    { id: "space11", name: "Internship Notifications", active: false },
    { id: "space12", name: "Drive Announcements", active: true },
    { id: "space13", name: "Placement Updates", active: true },
    { id: "space14", name: "Internship Notifications", active: false },
    { id: "space15", name: "Drive Announcements", active: true },
  ]);

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
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setSpacesOpen(true)}>
            <Settings size={16} />
            Configure
          </Button>
        </div>
      </div>

      <SpacesDialog
        open={spacesOpen}
        onOpenChange={setSpacesOpen}
        spaces={spaces}
        onSelectSpace={openConfigDialog}
        integrationName={integration.name}
        itemLabel={itemLabel}
      />

      <ConfigureSpaceDialog open={configOpen} onOpenChange={setConfigOpen} spaceName={selectedSpace} integrationName={integration.name} itemLabel={itemLabel} />
    </>
  );
}
