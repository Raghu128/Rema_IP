// routes/leaveRoutes.js
import express from "express";
import { getLeaveByid, updateLeave, deleteLeave, fetchLeavesByfacultyId, addLeave, updateLeaveStatus, fetchUsersOnLeaveCurrentMonth} from '../controllers/all.controller.js'

const router = express.Router();

router.get("/faculty/:facultyId", fetchLeavesByfacultyId);
router.get("/currentMonth/:facultyId", fetchUsersOnLeaveCurrentMonth);
router.get("/:id", getLeaveByid);
router.put("/faculty/:id", updateLeaveStatus);
router.put("/:id", updateLeave);
router.delete("/:id", deleteLeave);
router.post("/", addLeave);

export default router;
