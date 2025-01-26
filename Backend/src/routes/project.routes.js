import express from 'express';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for project CRUD
router.post('/', createProject);
// router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
