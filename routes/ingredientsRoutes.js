import express from 'express';
import IngredientController from '../controllers/IngredientController.js';
import multerConfig from '../middleware/multer-config.js';

// import isAuth   from '../middleware/isAuth.js';

const router = express.Router();

/***
 * POST /api/ingredients/create
 */
router.post('/create', multerConfig.single('image'), IngredientController.create);

/**
 * GET /api/ingredients
 * GET /api/ingredients/:id
 */
router.get('/', IngredientController.getAllIngredients);
router.get('/:id', IngredientController.getSingleIngredient);

/**
 * UPDATE /api/ingredients/:id
 */
router.put('/:id', multerConfig.single('image'), IngredientController.updateIngredient);

/**
 * DELETE /api/ingredients/:id
 */
router.delete('/:id', IngredientController.deleteSingleIngredient);

export default router;
