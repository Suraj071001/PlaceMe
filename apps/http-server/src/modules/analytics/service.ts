import { getStatsDAO, getDepartmentsAnalyticsDAO, getRecentActivityDAO, getUpcomingEventsDAO, getActivityFeedDAO, getAuditLogsDAO } from "./dao";

export const getStatsService = async (filters: any) => {
    return await getStatsDAO();
};

export const getDepartmentsAnalyticsService = async (filters: any) => {
    return await getDepartmentsAnalyticsDAO();
};

export const getRecentActivityService = async () => {
    return await getRecentActivityDAO();
};

export const getActivityFeedService = async (limit?: number) => {
    return await getActivityFeedDAO(limit ?? 50);
};

export const getAuditLogsService = async (limit?: number) => {
    return await getAuditLogsDAO(limit ?? 50);
};

export const getUpcomingEventsService = async () => {
    return await getUpcomingEventsDAO();
};
