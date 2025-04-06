import express from 'express';
import { handleUserSignup, handleUserLogin, getUsers, getUsersByFacultyId, updateUser, deleteUser,getStudentRelatedUsers, checkSession, forgotPassword, resetPassword, updateUserProfile, getfaculty} from '../controllers/all.controller.js';
import { authenticateToken } from '../middlewares/req.js';

const router = express.Router();

// Define routes for user CRUD


router.get('/', getUsers);
router.get('/faculty',authenticateToken, getfaculty);
router.get('/studentConnection/:id', getStudentRelatedUsers);
router.get('/check-session', checkSession);
router.get('/:id', authenticateToken, getUsersByFacultyId);
router.post('/login', handleUserLogin);
router.post('/add', authenticateToken, handleUserSignup);
router.put('/:id',authenticateToken, updateUser);
router.put('/update-profile/:id',authenticateToken, updateUserProfile);
router.delete('/:id',authenticateToken, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
