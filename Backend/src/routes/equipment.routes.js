import express from 'express';
import { createEquipment, getEquipments, getEquipmentById, updateEquipment, deleteEquipment } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for equipment CRUD
router.post('/', createEquipment);
// router.get('/', getEquipments);
router.get('/:id', getEquipmentById);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
