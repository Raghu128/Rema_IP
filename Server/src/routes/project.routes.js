import express from 'express';
import { createProject, getProjectByStudentId, getProjectById, updateProject, deleteProject } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for project CRUD
router.post('/', createProject);
router.get('/student/:id', getProjectByStudentId);
router.get('/:id', getProjectById);
// router.get('/:id/new-notes-count', getNewNotesCount);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
