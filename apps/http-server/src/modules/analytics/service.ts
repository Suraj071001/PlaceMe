import { getStatsDAO, getDepartmentsAnalyticsDAO, getRecentActivityDAO, getUpcomingEventsDAO } from "./dao";

export const getStatsService = async (filters: any) => {
    return await getStatsDAO();
};

export const getDepartmentsAnalyticsService = async (filters: any) => {
    return await getDepartmentsAnalyticsDAO();
};

export const getRecentActivityService = async () => {
    return await getRecentActivityDAO();
};

export const getUpcomingEventsService = async () => {
    return await getUpcomingEventsDAO();
};
