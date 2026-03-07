import { type Department } from "./data";

type AppliedFilters = Record<string, string[]> | undefined;

const timeRangeScale: Record<string, number> = {
  "Last 7 Days": 0.2,
  "Last 30 Days": 0.45,
  "Last 3 Months": 0.65,
  "Last 6 Months": 0.85,
  "Last Year": 1,
};

const tierProfile: Record<string, { count: number; package: number }> = {
  ALL: { count: 1, package: 1 },
  BASIC: { count: 1.18, package: 0.76 },
  STANDARD: { count: 0.9, package: 1.02 },
  DREAM: { count: 0.62, package: 1.35 },
};

const jobTypeProfile: Record<string, { placements: number; internships: number; offers: number; package: number }> = {
  "Full Time": { placements: 1.05, internships: 0.55, offers: 1.02, package: 1.1 },
  Internship: { placements: 0.55, internships: 1.2, offers: 0.68, package: 0.82 },
  "Part Time": { placements: 0.45, internships: 0.6, offers: 0.52, package: 0.72 },
  Contract: { placements: 0.5, internships: 0.45, offers: 0.6, package: 0.78 },
};

const parseLpa = (value: string) => {
  const num = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(num) ? num : 0;
};

const formatLpa = (value: number) => `\u20b9${value.toFixed(1)} LPA`;

const average = (values: number[]) => {
  if (values.length === 0) return 1;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getYearScale = (yearValue?: string) => {
  if (!yearValue) {
    return 1;
  }

  const year = Number(yearValue);
  if (!Number.isFinite(year)) {
    return 1;
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  // Older years are scaled down gradually to simulate lower recent activity.
  return clamp(1 - age * 0.04, 0.64, 1);
};

export function getFilteredDepartmentData(departments: Department[], appliedFilters: AppliedFilters): Department[] {
  const selectedDepartments = appliedFilters?.department ?? [];
  const selectedJobTypes = appliedFilters?.jobType ?? [];
  const selectedTiers = appliedFilters?.placementTier ?? [];
  const selectedDateRange = appliedFilters?.dateRange?.[0];
  const selectedYear = appliedFilters?.compareYears?.[0];

  const byDepartment = selectedDepartments.length > 0 ? departments.filter((dept) => selectedDepartments.includes(dept.name)) : departments;

  const dateScale = selectedDateRange ? (timeRangeScale[selectedDateRange] ?? 1) : 1;
  const yearScale = getYearScale(selectedYear);

  const tierCountScale = average(selectedTiers.map((tier) => tierProfile[tier]?.count ?? 1));
  const tierPackageScale = average(selectedTiers.map((tier) => tierProfile[tier]?.package ?? 1));

  const placementsTypeScale = average(selectedJobTypes.map((jobType) => jobTypeProfile[jobType]?.placements ?? 1));
  const internshipsTypeScale = average(selectedJobTypes.map((jobType) => jobTypeProfile[jobType]?.internships ?? 1));
  const offersTypeScale = average(selectedJobTypes.map((jobType) => jobTypeProfile[jobType]?.offers ?? 1));
  const packageTypeScale = average(selectedJobTypes.map((jobType) => jobTypeProfile[jobType]?.package ?? 1));
  const internshipOnly = selectedJobTypes.length === 1 && selectedJobTypes[0] === "Internship";

  return byDepartment.map((dept) => {
    const countBaseScale = clamp(dateScale * yearScale * tierCountScale, 0.15, 1.6);

    let placements = Math.max(0, Math.round(dept.placements * countBaseScale * placementsTypeScale));
    const internships = Math.max(0, Math.round(dept.internships * countBaseScale * internshipsTypeScale));
    const offers = Math.max(0, Math.round(dept.offers * countBaseScale * offersTypeScale));

    const packageScale = clamp(tierPackageScale * packageTypeScale, 0.55, 1.8);
    let avgLpa = parseLpa(dept.avgPackage) * packageScale;
    let highestLpa = parseLpa(dept.highestPackage) * packageScale;

    if (internshipOnly) {
      placements = 0;
      avgLpa = 0;
      highestLpa = 0;
    }

    const studentsPlaced = Math.max(0, Math.min(dept.eligibleStudents, placements));
    const rate = dept.eligibleStudents > 0 ? `${Math.round((studentsPlaced / dept.eligibleStudents) * 100)}%` : "0%";

    return {
      ...dept,
      placements,
      internships,
      offers,
      studentsPlaced,
      avgPackage: formatLpa(avgLpa),
      highestPackage: formatLpa(highestLpa),
      rate,
    };
  });
}
