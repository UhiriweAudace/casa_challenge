import express from 'express';
import IngredientController from '../controllers/IngredientController.js';
import isAuth from '../middleware/isAuth.js';
import multerConfig from '../middleware/multer-config.js';

const router = express.Router();

/***
 * POST /api/ingredients/create
 */
router.post('/create', isAuth, multerConfig.single('image'), IngredientController.create);

/**
 * GET /api/ingredients
 * GET /api/ingredients/:id
 */
router.get('/', isAuth, IngredientController.getAllIngredients);
router.get('/:id', isAuth, IngredientController.getSingleIngredient);

/**
 * UPDATE /api/ingredients/:id
 */
router.put('/:id', isAuth, multerConfig.single('image'), IngredientController.updateIngredient);

/**
 * DELETE /api/ingredients/:id
 */
router.delete('/:id', isAuth, IngredientController.deleteSingleIngredient);

export default router;
