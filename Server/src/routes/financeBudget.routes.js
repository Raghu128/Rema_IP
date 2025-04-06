import express from 'express';
import { createFinanceBudget, getFinanceBudgets, getFinanceBudgetById, updateFinanceBudget, deleteFinanceBudget } from '../controllers/all.controller.js';

const router = express.Router();

// Define routes for finance budget CRUD
router.post('/', createFinanceBudget);
router.get('/', getFinanceBudgets);
router.get('/:id', getFinanceBudgetById);
router.put('/:id', updateFinanceBudget);
router.delete('/:id', deleteFinanceBudget);

export default router;
