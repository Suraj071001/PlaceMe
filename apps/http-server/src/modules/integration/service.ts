import { getIntegrationsDAO, connectIntegrationDAO, disconnectIntegrationDAO } from "./dao";

export const getIntegrationsService = async () => {
    return await getIntegrationsDAO();
};

export const connectIntegrationService = async (provider: string, data: any) => {
    return await connectIntegrationDAO(provider, data);
};

export const disconnectIntegrationService = async (provider: string) => {
    return await disconnectIntegrationDAO(provider);
};
