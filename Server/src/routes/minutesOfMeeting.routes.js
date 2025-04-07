import express from 'express';
import { 
  createMinutesOfMeeting, 
  getMinutesOfMeetings, 
  getMinutesOfMeetingById, 
  updateMinutesOfMeeting, 
  deleteMinutesOfMeeting 
} from '../controllers/all.controller.js';

// Middleware to attach io instance to requests
const attachIO = (io) => (req, res, next) => {
  req.io = io;  
  next();
};

const createMinutesRouter = (io) => {
  const router = express.Router();

  // Apply io middleware only to routes that need it
  router.post('/', attachIO(io), createMinutesOfMeeting);
  router.get('/', getMinutesOfMeetings);
  router.get('/:id', attachIO(io), getMinutesOfMeetingById);
  router.put('/:id', updateMinutesOfMeeting);
  router.delete('/:id', deleteMinutesOfMeeting);

  return router;
};

export default createMinutesRouter;