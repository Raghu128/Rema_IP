import express from 'express';
import { createVenueList, getVenueLists, getVenueByIdList, updateVenueList, deleteVenueList } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for venue list CRUD
router.post('/', createVenueList);
router.get('/', getVenueLists);
router.get('/:id', getVenueByIdList);
router.put('/:id', updateVenueList);
router.delete('/:id', deleteVenueList);

export default router;
