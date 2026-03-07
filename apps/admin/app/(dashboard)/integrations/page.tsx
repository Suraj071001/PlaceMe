"use client";

import { integrations } from "../../components/data";
import IntegrationCard from "./components/IntegerationCard";
import { useState, useEffect } from "react";
import { API_BASE, getAuthHeaders } from "../../lib/api";

export default function IntegrationsPage() {
  const [integrationsData, setIntegrationsData] = useState<any[]>(integrations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const res = await fetch(`${API_BASE}/integrations`, {
          headers: getAuthHeaders(),
        });
        const json = await res.json();
        if (json.success && json.data) {
          setIntegrationsData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch integrations", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-6 px-3 py-4 sm:px-5 sm:py-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>

          <p className="text-gray-500 text-sm">Connect your placement portal with communication tools</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {loading ? (
          <div className="text-slate-500 text-sm">Loading integrations...</div>
        ) : (
          integrationsData.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))
        )}
      </div>
    </div>
  );
}
