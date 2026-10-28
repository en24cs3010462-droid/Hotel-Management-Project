import { Router } from 'express';
import {
  getRooms,
  getRoomById,
  checkAvailability,
  createRoom,
  updateRoom,
  deleteRoom
} from '../controllers/roomController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getRooms);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);
router.post('/', requireAdmin, createRoom);
router.put('/:id', requireAdmin, updateRoom);
router.delete('/:id', requireAdmin, deleteRoom);

export default router;
