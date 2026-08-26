import express from 'express';
import { create, getAll, getById, update, remove } from '../controllers/equipmentController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getAll)
    .post(restrictTo('HOSPITAL_ADMIN'), create);

router.route('/:id')
    .get(getById)
    .put(restrictTo('HOSPITAL_ADMIN', 'SERVICE_ENGINEER'), update)
    .delete(restrictTo('HOSPITAL_ADMIN'), remove);

export default router;