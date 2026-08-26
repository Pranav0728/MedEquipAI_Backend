import { successResponse, errorResponse } from '../utils/response.js';
import {
    createBreakdown,
    getAllBreakdowns,
    getBreakdownById,
    updateBreakdown,
    getBreakdownsByEquipmentId,
} from '../services/breakdownService.js';

export const create = async (req, res, next) => {
    try {
        const breakdown = await createBreakdown(req.body);
        const populated = await getBreakdownById(breakdown._id);
        successResponse(res, { breakdown: populated }, 'Breakdown reported successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const breakdowns = await getAllBreakdowns(req.query);
        successResponse(res, { breakdowns }, 'Breakdowns retrieved');
    } catch (error) {
        next(error);
    }
};

export const getByEquipment = async (req, res, next) => {
    try {
        const breakdowns = await getBreakdownsByEquipmentId(req.params.equipmentId);
        successResponse(res, { breakdowns }, 'Breakdowns retrieved');
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const breakdown = await updateBreakdown(req.params.id, req.body);
        if (!breakdown) {
            return errorResponse(res, 'Breakdown record not found', 404);
        }
        successResponse(res, { breakdown }, 'Breakdown updated successfully');
    } catch (error) {
        next(error);
    }
};