import express from 'express';
import { create, getAll, getByEquipment, update } from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAll)
    .post(create);

router.route('/equipment/:equipmentId')
    .get(getByEquipment);

router.route('/:id')
    .put(update);

export default router;