import express from 'express';
import { createSponsorProject, getSponsorProjects, getSponsorProjectById, updateSponsorProject, deleteSponsorProject } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for sponsor project CRUD
router.post('/', createSponsorProject);
// router.get('/', getSponsorProjects);
router.get('/:id', getSponsorProjectById);
router.put('/:id', updateSponsorProject);
router.delete('/:id', deleteSponsorProject);

export default router;
