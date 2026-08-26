import { successResponse, errorResponse } from '../utils/response.js';
import {
    createMaintenance,
    getAllMaintenance,
    getMaintenanceById,
    updateMaintenance,
    getMaintenanceByEquipmentId,
} from '../services/maintenanceService.js';

export const create = async (req, res, next) => {
    try {
        const maintenance = await createMaintenance(req.body);
        const populated = await getMaintenanceById(maintenance._id);
        successResponse(res, { maintenance: populated }, 'Maintenance scheduled successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const maintenance = await getAllMaintenance(req.query);
        successResponse(res, { maintenance }, 'Maintenance records retrieved');
    } catch (error) {
        next(error);
    }
};

export const getByEquipment = async (req, res, next) => {
    try {
        const maintenance = await getMaintenanceByEquipmentId(req.params.equipmentId);
        successResponse(res, { maintenance }, 'Maintenance records retrieved');
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const maintenance = await updateMaintenance(req.params.id, req.body);
        if (!maintenance) {
            return errorResponse(res, 'Maintenance record not found', 404);
        }
        successResponse(res, { maintenance }, 'Maintenance updated successfully');
    } catch (error) {
        next(error);
    }
};