import express from 'express';
import { handleUserSignup, handleUserLogin, getUsers, getUsersByFacultyId, updateUser, deleteUser, checkSession, forgotPassword, resetPassword, updateUserProfile, getfaculty} from '../controllers/all.controller.js';
import { authenticateToken } from '../middlewares/req.js';

const router = express.Router();

// Define routes for user CRUD


router.get('/', getUsers);
router.get('/faculty', getfaculty);
router.get('/check-session', checkSession);
router.get('/:id', getUsersByFacultyId);
router.post('/login', handleUserLogin);
router.post('/add',authenticateToken, handleUserSignup);
router.put('/:id', updateUser);
router.put('/update-profile/:id', updateUserProfile);
router.delete('/:id', deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
