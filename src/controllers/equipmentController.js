import { successResponse, errorResponse } from '../utils/response.js';
import {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment,
    getEquipmentByEquipmentId,
} from '../services/equipmentService.js';
import { calculateRiskForAllEquipment, calculateRiskScore } from '../services/riskService.js';

export const create = async (req, res, next) => {
    try {
        const equipment = await createEquipment(req.body);
        successResponse(res, { equipment }, 'Equipment created successfully', 201);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const equipment = await getAllEquipment(req.query);
        const equipmentWithRisk = await calculateRiskForAllEquipment(equipment);
        successResponse(res, { equipment: equipmentWithRisk }, 'Equipment retrieved');
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        let equipment;
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            equipment = await getEquipmentById(req.params.id);
        } else {
            equipment = await getEquipmentByEquipmentId(req.params.id);
        }

        if (!equipment) {
            return errorResponse(res, 'Equipment not found', 404);
        }

        const risk = await calculateRiskScore(equipment);

        successResponse(
            res,
            {
                equipment: {
                    ...equipment.toObject(),
                    riskScore: risk.score,
                    riskLevel: risk.level,
                    riskFactors: risk.factors,
                    age: risk.age,
                },
            },
            'Equipment retrieved'
        );
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const equipment = await updateEquipment(req.params.id, req.body);
        if (!equipment) {
            return errorResponse(res, 'Equipment not found', 404);
        }
        successResponse(res, { equipment }, 'Equipment updated successfully');
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const equipment = await deleteEquipment(req.params.id);
        if (!equipment) {
            return errorResponse(res, 'Equipment not found', 404);
        }
        successResponse(res, null, 'Equipment deleted successfully');
    } catch (error) {
        next(error);
    }
};