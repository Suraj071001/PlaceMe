"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { AddCompanyDialog } from "./components/AddCompanyDialog";
import { CompanyFilters } from "./components/CompanyFilters";
import { CompanyTable, type Company } from "./components/CompanyTable";
import { API_BASE } from "../../lib/api";

const COMPANY_STATUSES: Company["status"][] = ["CONTACTED", "INTERESTED", "NOT_INTERESTED", "DRIVE_COMPLETED", "OFFER_RELEASED", "ON_HOLD", "BLACKLISTED"];

type BranchOption = {
  id: string;
  name: string;
};

type ApiCompany = {
  id: string;
  name: string;
  domain?: string | null;
  status: Company["status"];
  industry: string;
  faculty_coordinator: string;
  branchId: string;
  branch?: {
    id: string;
    name: string;
  } | null;
};

type NewCompanyPayload = {
  name: string;
  domain: string;
  industry: string;
  facultyCoordinator: string;
  status: Company["status"];
  branchId: string;
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const mapApiCompanyToUi = (company: ApiCompany): Company => ({
  id: company.id,
  name: company.name,
  domain: company.domain ?? "-",
  industry: company.industry ?? "-",
  facultyCoordinator: company.faculty_coordinator ?? "-",
  branch: company.branch?.name ?? "-",
  status: company.status,
});

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [branchOptions, setBranchOptions] = useState<BranchOption[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [branchOptionsError, setBranchOptionsError] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "100",
      });

      const trimmedName = searchQuery.trim();
      if (trimmedName) {
        params.set("name", trimmedName);
      }
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (branchFilter !== "all") {
        params.set("branchId", branchFilter);
      }

      const response = await fetch(`${API_BASE}/company?${params.toString()}`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error ?? payload?.message ?? "Failed to load companies");
      }

      const apiCompanies: ApiCompany[] = Array.isArray(payload?.data) ? payload.data : [];
      setCompanies(apiCompanies.map(mapApiCompanyToUi));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load companies";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter, branchFilter]);

  useEffect(() => {
    const debounceId = setTimeout(() => {
      void fetchCompanies();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [fetchCompanies]);

  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoadingBranches(true);
      setBranchOptionsError("");

      try {
        const response = await fetch(`${API_BASE}/company/branches`, {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.message ?? "Failed to load branches");
        }

        const branches: BranchOption[] = Array.isArray(payload?.data) ? payload.data : [];
        const uniqueBranchMap = new Map(branches.map((branch) => [branch.id, branch]));
        setBranchOptions(Array.from(uniqueBranchMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
      } catch (error) {
        setBranchOptions([]);
        const message = error instanceof Error ? error.message : "Failed to load branches";
        setBranchOptionsError(message);
      } finally {
        setIsLoadingBranches(false);
      }
    };

    void fetchBranches();
  }, []);

  const handleAddCompany = (company: NewCompanyPayload) => {
    const createCompany = async () => {
      try {
        const response = await fetch(`${API_BASE}/company`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: company.name,
            domain: company.domain || undefined,
            industry: company.industry,
            faculty_coordinator: company.facultyCoordinator,
            branchId: company.branchId,
            status: company.status,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.message ?? "Failed to create company");
        }

        void fetchCompanies();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create company";
        setErrorMessage(message);
      }
    };

    void createCompany();
  };

  const handleDeleteCompany = (id: string) => {
    const deleteCompany = async () => {
      try {
        const response = await fetch(`${API_BASE}/company/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? payload?.message ?? "Failed to delete company");
        }

        void fetchCompanies();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete company";
        setErrorMessage(message);
      }
    };

    void deleteCompany();
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <Building2 className="w-6 h-6 text-indigo-600" />

          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-slate-800">Company Management</h1>
            <p className="text-sm text-slate-500">Manage recruiters, company history and placement drives</p>
          </div>
        </div>

        <AddCompanyDialog
          onAddCompany={handleAddCompany}
          branchOptions={branchOptions}
          isLoadingBranches={isLoadingBranches}
          branchOptionsError={branchOptionsError}
        />
      </div>

      {/* Filters Section */}
      <section>
        <CompanyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={COMPANY_STATUSES}
          branchFilter={branchFilter}
          setBranchFilter={setBranchFilter}
          branchOptions={branchOptions}
        />
      </section>

      {/* Table Section */}
      <section>
        {errorMessage && <p className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
        {isLoading && <p className="mb-3 text-sm text-slate-500">Loading companies...</p>}
        <CompanyTable companies={companies} onDeleteCompany={handleDeleteCompany} />
      </section>
    </div>
  );
}
