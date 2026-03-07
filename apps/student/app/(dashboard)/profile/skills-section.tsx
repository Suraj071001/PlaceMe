"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Button } from "@repo/ui/components/button";

type SkillsSectionProps = {
    skills: string[];
    isEditing?: boolean;
    onChange: (skills: string[]) => void;
};

export function SkillsSection({ skills, isEditing = true, onChange }: SkillsSectionProps) {
    const [skillInput, setSkillInput] = useState("");

    const addSkill = () => {
        if (!isEditing) return;
        const trimmed = skillInput.trim();
        if (trimmed && !skills.includes(trimmed)) {
            onChange([...skills, trimmed]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        if (!isEditing) return;
        onChange(skills.filter((s) => s !== skillToRemove));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent) => {
        if (!isEditing) return;
        if (e.key === "Enter") {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">Skills</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a skill and press Enter"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            disabled={!isEditing}
                        />
                        <Button variant="outline" size="icon" onClick={addSkill} className="shrink-0" disabled={!isEditing}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-3 py-1 text-sm"
                            >
                                {skill}
                                {isEditing && (
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="ml-0.5 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        ×
                                    </button>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
