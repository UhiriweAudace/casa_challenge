import express from 'express';
import isAuth from '../middleware/isAuth.js';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

/** POST //return Jwt Token */
router.post('/login', AuthController.login);

// return current user and Private Access
router.get('/current', isAuth, AuthController.getCurrentUser);

export default router;
