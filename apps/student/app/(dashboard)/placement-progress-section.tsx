"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Briefcase, CheckCircle2, MessageSquare } from "lucide-react";

type Stat = {
  title: string;
  value: number;
  icon: "applications" | "shortlisted" | "interviews";
};

type PlacementProgressSectionProps = {
  stats: Stat[];
};

const iconConfig = {
  applications: {
    Icon: Briefcase,
    bg: "bg-[#F3F4FB]",
    text: "text-[#6B728E]", // or primary brand color if available, let's use a nice purple/blue
    iconColor: "text-indigo-500",
  },
  shortlisted: {
    Icon: CheckCircle2,
    bg: "bg-[#E8F8F5]",
    text: "text-[#10B981]",
    iconColor: "text-emerald-500",
  },
  interviews: {
    Icon: MessageSquare,
    bg: "bg-[#F5F0FF]",
    text: "text-[#8B5CF6]",
    iconColor: "text-purple-500",
  },
};

export function PlacementProgressSection({
  stats,
}: PlacementProgressSectionProps) {
  return (
    <Card className="bg-gradient-to-br from-[#4f46e5]/5 to-[#10b981]/5 border-primary/20 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-900">
          Your Placement Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((stat) => {
            const { Icon, bg, iconColor } = iconConfig[stat.icon];
            return (
              <div
                key={stat.title}
                className="flex flex-1 items-center gap-4 py-4 md:py-2 md:px-6 first:md:pl-0 last:md:pr-0"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
                >
                  <Icon className={`h-6 w-6 ${iconColor}`} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
