import Maintenance from '../models/Maintenance.js';
import mongoose from 'mongoose';

export const createMaintenance = async (maintenanceData) => {
    const maintenance = await Maintenance.create(maintenanceData);
    return maintenance;
};

export const getAllMaintenance = async (query = {}) => {
    const { equipmentId, status, type } = query;

    let filter = {};

    if (equipmentId) {
        filter.equipment = new mongoose.Types.ObjectId(equipmentId);
    }
    if (status) filter.status = status;
    if (type) filter.type = type;

    const maintenance = await Maintenance.find(filter)
        .populate('equipment', 'name equipmentId department location')
        .sort({ scheduledDate: -1 });

    return maintenance;
};

export const getMaintenanceById = async (id) => {
    const maintenance = await Maintenance.findById(id).populate(
        'equipment',
        'name equipmentId department location'
    );
    return maintenance;
};

export const getMaintenanceByEquipmentId = async (equipmentId) => {
    const maintenance = await Maintenance.find({ equipment: equipmentId })
        .populate('equipment', 'name equipmentId')
        .sort({ scheduledDate: -1 });
    return maintenance;
};

export const updateMaintenance = async (id, updateData) => {
    if (updateData.status === 'COMPLETED' && !updateData.completedDate) {
        updateData.completedDate = new Date();
    }

    const maintenance = await Maintenance.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    }).populate('equipment', 'name equipmentId department location');

    return maintenance;
};

export const getMaintenanceStats = async () => {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [dueSoon, overdue] = await Promise.all([
        Maintenance.countDocuments({
            status: 'SCHEDULED',
            scheduledDate: { $gte: now, $lte: thirtyDaysLater },
        }),
        Maintenance.countDocuments({
            status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
            scheduledDate: { $lt: now },
        }),
    ]);

    return { dueSoon, overdue, totalDue: dueSoon + overdue };
};

export const updateOverdueMaintenance = async () => {
    const now = new Date();
    const result = await Maintenance.updateMany(
        {
            status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
            scheduledDate: { $lt: now },
        },
        { status: 'OVERDUE' }
    );
    return result;
};