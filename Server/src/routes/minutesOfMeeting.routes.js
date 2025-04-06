import express from 'express';
import { createMinutesOfMeeting, getMinutesOfMeetings, getMinutesOfMeetingById, updateMinutesOfMeeting, deleteMinutesOfMeeting } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for minutes of meeting CRUD
router.post('/', createMinutesOfMeeting);
router.get('/', getMinutesOfMeetings);
router.get('/:id', getMinutesOfMeetingById);
router.put('/:id', updateMinutesOfMeeting);
router.delete('/:id', deleteMinutesOfMeeting);

export default router;
