import express from 'express';
import { createSupervisor, getSupervisors, getSupervisorById, updateSupervisor, deleteSupervisor } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for supervisor CRUD
router.get('/:id', getSupervisorById);
// router.get('/', getSupervisors);
router.post('/', createSupervisor);
router.put('/:id', updateSupervisor);
router.delete('/:id', deleteSupervisor);

export default router;
