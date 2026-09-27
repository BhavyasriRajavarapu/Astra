import { Router } from 'express';
import { WatchlistController } from '../controllers/watchlistController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Allow authenticated users to get/modify their user-specific watchlist, with optional fallback
router.get('/', optionalAuth, WatchlistController.getWatchlist);
router.post('/', optionalAuth, WatchlistController.addToWatchlist);
router.delete('/:id', optionalAuth, WatchlistController.removeFromWatchlist);

export default router;
