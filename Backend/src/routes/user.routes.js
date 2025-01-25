import express from 'express';
import { handleUserSignup, handleUserLogin, getUsers, updateUser, deleteUser, checkSession } from '../controllers/all.controller.js';
import { authenticateToken } from '../middlewares/req.js';

const router = express.Router();

// Define routes for user CRUD


router.get('/', getUsers);
router.post('/login', handleUserLogin);
router.post('/add',authenticateToken, handleUserSignup);
router.get('/check-session', checkSession);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
