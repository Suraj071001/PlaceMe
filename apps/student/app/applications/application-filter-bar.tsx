"use client";

import { useState } from "react";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";
import { Filter, ChevronUp, ChevronDown, Settings2 } from "lucide-react";

export type ApplicationFilters = {
    search: string;
    jobType: string;
    status: string;
    tier: string;
    location: string;
    minPackage: string;
    maxPackage: string;
    appliedFrom: string;
    appliedTo: string;
};

export const defaultFilters: ApplicationFilters = {
    search: "",
    jobType: "",
    status: "",
    tier: "",
    location: "",
    minPackage: "",
    maxPackage: "",
    appliedFrom: "",
    appliedTo: "",
};

type ApplicationFilterBarProps = {
    filters: ApplicationFilters;
    onFilterChange: (filters: ApplicationFilters) => void;
    isOpen: boolean;
    statuses: string[];
    locations: string[];
};

const selectClasses =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

export function ApplicationFilterBar({
    filters,
    onFilterChange,
    isOpen,
    statuses,
    locations,
}: ApplicationFilterBarProps) {
    const [advancedOpen, setAdvancedOpen] = useState(false);

    const update = (key: keyof ApplicationFilters, value: string) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({ ...defaultFilters });
    };

    if (!isOpen) return null;

    return (
        <Card>
            <CardContent className="space-y-4 pt-5 pb-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                        <Filter className="h-4 w-4" />
                        Filter Applications
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-7 text-xs text-muted-foreground"
                    >
                        Clear All
                    </Button>
                </div>

                {/* Basic filters row */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                            Search Company or Role
                        </label>
                        <Input
                            placeholder="Type to search..."
                            value={filters.search}
                            onChange={(e) => update("search", e.target.value)}
                            className="h-9"
                        />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                            Job Type
                        </label>
                        <select
                            value={filters.jobType}
                            onChange={(e) => update("jobType", e.target.value)}
                            className={selectClasses}
                        >
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                            Application Status
                        </label>
                        <select
                            value={filters.status}
                            onChange={(e) => update("status", e.target.value)}
                            className={selectClasses}
                        >
                            <option value="">All Statuses</option>
                            {statuses.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Advanced filters toggle */}
                <button
                    onClick={() => setAdvancedOpen(!advancedOpen)}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Settings2 className="h-3.5 w-3.5" />
                    Advanced Filters
                    {advancedOpen ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                    )}
                </button>

                {/* Advanced filters */}
                {advancedOpen && (
                    <div className="space-y-4 border-t pt-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Company Tier
                                </label>
                                <select
                                    value={filters.tier}
                                    onChange={(e) => update("tier", e.target.value)}
                                    className={selectClasses}
                                >
                                    <option value="">All Tiers</option>
                                    <option value="Dream">Dream</option>
                                    <option value="Tier 1">Tier 1</option>
                                    <option value="Tier 2">Tier 2</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Location
                                </label>
                                <select
                                    value={filters.location}
                                    onChange={(e) => update("location", e.target.value)}
                                    className={selectClasses}
                                >
                                    <option value="">All Locations</option>
                                    {locations.map((loc) => (
                                        <option key={loc} value={loc}>
                                            {loc}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Min Package (LPA)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minPackage}
                                    onChange={(e) => update("minPackage", e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Max Package (LPA)
                                </label>
                                <Input
                                    type="number"
                                    placeholder="100"
                                    value={filters.maxPackage}
                                    onChange={(e) => update("maxPackage", e.target.value)}
                                    className="h-9"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Applied From
                                </label>
                                <Input
                                    type="date"
                                    value={filters.appliedFrom}
                                    onChange={(e) => update("appliedFrom", e.target.value)}
                                    className="h-9"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
                                    Applied To
                                </label>
                                <Input
                                    type="date"
                                    value={filters.appliedTo}
                                    onChange={(e) => update("appliedTo", e.target.value)}
                                    className="h-9"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
