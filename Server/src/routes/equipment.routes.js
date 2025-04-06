import express from 'express';
import { createEquipment, getEquipments, getEquipmentById, updateEquipment, deleteEquipment, getEquipmentByUsingId} from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for equipment CRUD
router.get('/used/:id', getEquipmentByUsingId);
router.get('/:id', getEquipmentById);
router.post('/', createEquipment);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
