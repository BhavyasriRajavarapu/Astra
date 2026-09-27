import { Router } from 'express';
import { AsteroidController } from '../controllers/asteroidController.js';

const router = Router();

router.get('/feed', AsteroidController.getFeed);
router.get('/stats', AsteroidController.getStats);
router.get('/upcoming', AsteroidController.getUpcoming);
router.get('/search', AsteroidController.search);
router.get('/:id', AsteroidController.getById);

export default router;
