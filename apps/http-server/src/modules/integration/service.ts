import { getIntegrationsDAO, connectIntegrationDAO, disconnectIntegrationDAO, getGoogleChatSpacesDAO } from "./dao";

export const getIntegrationsService = async () => {
    return await getIntegrationsDAO();
};

export const connectIntegrationService = async (provider: string, data: any) => {
    return await connectIntegrationDAO(provider, data);
};

export const disconnectIntegrationService = async (provider: string) => {
    return await disconnectIntegrationDAO(provider);
};

export const getGoogleChatSpacesService = async () => {
    return await getGoogleChatSpacesDAO();
};
