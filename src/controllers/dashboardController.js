import { successResponse } from '../utils/response.js';
import { getDashboardData } from '../services/dashboardService.js';

export const getDashboard = async (req, res, next) => {
    try {
        const dashboardData = await getDashboardData();
        successResponse(res, dashboardData, 'Dashboard data retrieved');
    } catch (error) {
        next(error);
    }
};