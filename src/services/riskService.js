import Maintenance from '../models/Maintenance.js';
import Breakdown from '../models/Breakdown.js';

const CRITICALITY_SCORES = {
    HIGH: 30,
    MEDIUM: 20,
    LOW: 10,
};

export const calculateRiskScore = async (equipment) => {
    let score = 0;
    const factors = [];

    // 1. Criticality
    const criticalityScore = CRITICALITY_SCORES[equipment.criticality] || 0;
    score += criticalityScore;
    factors.push({
        type: 'criticality',
        value: equipment.criticality,
        points: criticalityScore,
    });

    // 2. Recent breakdowns (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentBreakdowns = await Breakdown.countDocuments({
        equipment: equipment._id,
        reportedDate: { $gte: sixMonthsAgo },
    });

    let breakdownScore = 0;
    if (recentBreakdowns >= 3) breakdownScore = 30;
    else if (recentBreakdowns === 2) breakdownScore = 20;
    else if (recentBreakdowns === 1) breakdownScore = 10;

    score += breakdownScore;
    factors.push({
        type: 'breakdowns',
        value: recentBreakdowns,
        points: breakdownScore,
    });

    // 3. Maintenance overdue
    const now = new Date();
    const overdueMaintenance = await Maintenance.countDocuments({
        equipment: equipment._id,
        status: { $in: ['OVERDUE', 'SCHEDULED', 'IN_PROGRESS'] },
        scheduledDate: { $lt: now },
    });

    let maintenanceScore = overdueMaintenance > 0 ? 20 : 0;
    score += maintenanceScore;
    factors.push({
        type: 'maintenance',
        value: overdueMaintenance > 0 ? 'Overdue' : 'Current',
        points: maintenanceScore,
    });

    // 4. Equipment age (> 5 years)
    const purchaseDate = new Date(equipment.purchaseDate);
    const ageInYears = (now - purchaseDate) / (365.25 * 24 * 60 * 60 * 1000);

    let ageScore = ageInYears > 5 ? 10 : 0;
    score += ageScore;
    factors.push({
        type: 'age',
        value: `${Math.round(ageInYears)} years`,
        points: ageScore,
    });

    // 5. Maintenance due soon (next 7 days)
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueSoon = await Maintenance.countDocuments({
        equipment: equipment._id,
        status: 'SCHEDULED',
        scheduledDate: { $gte: now, $lte: sevenDaysLater },
    });

    let dueSoonScore = dueSoon > 0 ? 10 : 0;
    score += dueSoonScore;
    if (dueSoonScore > 0) {
        factors.push({
            type: 'dueSoon',
            value: dueSoon,
            points: dueSoonScore,
        });
    }

    // Cap at 100
    score = Math.min(score, 100);

    // Determine risk level
    let level;
    if (score <= 30) level = 'LOW';
    else if (score <= 60) level = 'MEDIUM';
    else if (score <= 80) level = 'HIGH';
    else level = 'CRITICAL';

    return {
        score,
        level,
        factors,
        age: Math.round(ageInYears * 10) / 10,
        recentBreakdowns,
    };
};

export const calculateRiskForAllEquipment = async (equipmentList) => {
    const results = await Promise.all(
        equipmentList.map(async (eq) => {
            const risk = await calculateRiskScore(eq);
            return {
                ...eq.toObject(),
                riskScore: risk.score,
                riskLevel: risk.level,
                riskFactors: risk.factors,
            };
        })
    );
    return results;
};

export const getRiskDistribution = async (equipmentList) => {
    const distribution = {
        LOW: 0,
        MEDIUM: 0,
        HIGH: 0,
        CRITICAL: 0,
    };

    for (const eq of equipmentList) {
        const risk = await calculateRiskScore(eq);
        distribution[risk.level]++;
    }

    return distribution;
};