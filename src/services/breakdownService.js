import Breakdown from '../models/Breakdown.js';
import mongoose from 'mongoose';

export const createBreakdown = async (breakdownData) => {
    const breakdown = await Breakdown.create(breakdownData);
    return breakdown;
};

export const getAllBreakdowns = async (query = {}) => {
    const { equipmentId, severity, status } = query;

    let filter = {};

    if (equipmentId) {
        filter.equipment = new mongoose.Types.ObjectId(equipmentId);
    }
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const breakdowns = await Breakdown.find(filter)
        .populate('equipment', 'name equipmentId department location')
        .sort({ reportedDate: -1 });

    return breakdowns;
};

export const getBreakdownById = async (id) => {
    const breakdown = await Breakdown.findById(id).populate(
        'equipment',
        'name equipmentId department location'
    );
    return breakdown;
};

export const getBreakdownsByEquipmentId = async (equipmentId) => {
    const breakdowns = await Breakdown.find({ equipment: equipmentId })
        .populate('equipment', 'name equipmentId')
        .sort({ reportedDate: -1 });
    return breakdowns;
};

export const updateBreakdown = async (id, updateData) => {
    const breakdown = await Breakdown.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate('equipment', 'name equipmentId department location');

    return breakdown;
};

export const getBreakdownStats = async () => {
    const [bySeverity, byStatus, openCount] = await Promise.all([
        Breakdown.aggregate([
            {
                $group: {
                    _id: '$severity',
                    count: { $sum: 1 },
                },
            },
        ]),
        Breakdown.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]),
        Breakdown.countDocuments({ status: { $in: ['OPEN', 'IN_PROGRESS'] } }),
    ]);

    const severityResult = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };

    bySeverity.forEach((stat) => {
        severityResult[stat._id] = stat.count;
    });

    return {
        bySeverity: severityResult,
        openCount,
    };
};

export const getRecentBreakdowns = async (limit = 10) => {
    const breakdowns = await Breakdown.find()
        .populate('equipment', 'name equipmentId department')
        .sort({ reportedDate: -1 })
        .limit(limit);
    return breakdowns;
};