"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

type Space = {
  id: string;
  name: string;
  active?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  spaces: Space[];
  loading?: boolean;
  error?: string | null;
  onSelectSpace: (space: string) => void;
  integrationName: string;
  itemLabel?: string;
};

export default function SpacesDialog({ open, onOpenChange, spaces, loading = false, error = null, onSelectSpace, integrationName, itemLabel = "Channel" }: Props) {
  const [query, setQuery] = useState("");

  const filteredSpaces = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return spaces;
    }

    return spaces.filter((space) => space.name.toLowerCase().includes(normalizedQuery) || space.id.toLowerCase().includes(normalizedQuery));
  }, [spaces, query]);

  const activeCount = spaces.filter((space) => space.active !== false).length;

  const handleAddSpace = () => {
    onSelectSpace("new");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
  sm:max-w-[680px]
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=open]:fade-in-0
  data-[state=closed]:fade-out-0
  data-[state=open]:zoom-in-95
  data-[state=closed]:zoom-out-95
  data-[state=closed]:slide-out-to-left-8
  duration-200
"
      >
        <DialogHeader>
          <DialogTitle>
            {integrationName} {itemLabel}s
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg border bg-slate-50/70 p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-white px-2 py-1 font-medium text-slate-700">Total: {spaces.length}</span>
              <span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-700">Active: {activeCount}</span>
              <span className="rounded-full bg-gray-200 px-2 py-1 font-medium text-gray-700">Inactive: {spaces.length - activeCount}</span>
              <span className="ml-auto font-medium text-slate-500">Showing {filteredSpaces.length}</span>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search by ${itemLabel.toLowerCase()} name or id`}
                className="h-10 border-slate-300 bg-white pl-9"
              />
            </div>
          </div>

          <div className="max-h-[50vh] overflow-y-auto rounded-lg border">
            {loading ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">Loading {itemLabel.toLowerCase()}s...</div>
            ) : error ? (
              <div className="px-4 py-8 text-center text-sm text-red-500">{error}</div>
            ) : filteredSpaces.length > 0 ? (
              filteredSpaces.map((space) => (
                <button
                  key={space.id}
                  type="button"
                  onClick={() => onSelectSpace(space.id)}
                  className="flex w-full items-center justify-between border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">{space.name}</p>
                    <p className="truncate text-xs text-slate-500">{space.id}</p>
                  </div>

                  {space.active !== false ? (
                    <span className="ml-3 shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">Active</span>
                  ) : (
                    <span className="ml-3 shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">Inactive</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                No {itemLabel.toLowerCase()}s found for <span className="font-medium">{query.trim()}</span>.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full flex items-center gap-2" onClick={handleAddSpace}>
            <Plus size={16} />
            Add {itemLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
