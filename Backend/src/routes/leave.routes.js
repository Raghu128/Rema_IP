// routes/leaveRoutes.js
import express from "express";
import { getLeaveByid, updateLeave, deleteLeave, fetchLeavesByfacultyId, addLeave} from '../controllers/all.controller.js'

const router = express.Router();

router.get("/faculty/:facultyId", fetchLeavesByfacultyId);
router.get("/:id", getLeaveByid);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);
router.post("/", addLeave);

export default router;
