import express from 'express';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for user CRUD
router.post('/', createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
