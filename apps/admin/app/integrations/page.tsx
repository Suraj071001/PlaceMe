import { integrations } from "../components/data";
import IntegrationCard from "./IntegerationCard";

export default function IntegrationsPage() {
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>

          <p className="text-gray-500 text-sm">Connect your placement portal with communication tools</p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
