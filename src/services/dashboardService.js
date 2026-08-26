import Equipment from '../models/Equipment.js';
import { getEquipmentStats } from './equipmentService.js';
import { getMaintenanceStats } from './maintenanceService.js';
import { getBreakdownStats, getRecentBreakdowns } from './breakdownService.js';
import { getRiskDistribution } from './riskService.js';

export const getDashboardData = async () => {
    const [totalEquipment, equipmentStats, maintenanceStats, breakdownStats] =
        await Promise.all([
            Equipment.countDocuments(),
            getEquipmentStats(),
            getMaintenanceStats(),
            getBreakdownStats(),
        ]);

    const criticalEquipment = await Equipment.countDocuments({ criticality: 'HIGH' });

    const allEquipment = await Equipment.find();
    const riskDistribution = await getRiskDistribution(allEquipment);

    const recentBreakdowns = await getRecentBreakdowns(10);

    return {
        totalEquipment,
        activeEquipment: equipmentStats.active,
        maintenanceDue: maintenanceStats.totalDue,
        openBreakdowns: breakdownStats.openCount,
        criticalEquipment,
        equipmentStatus: equipmentStats,
        breakdownsBySeverity: breakdownStats.bySeverity,
        riskDistribution,
        recentBreakdowns,
    };
};