const express = require('express');
const {
  createTicket,
  getTickets,
  getTicket,
  addReply,
  updateTicketStatus,
  assignTicket,
  updatePriority,
  getTicketStats,
  reviewTicket
} = require('../controllers/tickets');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Make stats route accessible to admins with proper authentication
router.route('/stats')
  .get(protect, authorize('admin'), getTicketStats);

// Protect all other routes
router.use(protect);

// Routes accessible by all authenticated users
router.route('/')
  .post(createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicket);

router.route('/:id/replies')
  .post(addReply);

// Add review endpoint
router.route('/:id/review')
  .put(reviewTicket);

// Admin only routes
router.route('/:id/status')
  .put(authorize('admin'), updateTicketStatus);

router.route('/:id/assign')
  .put(authorize('admin'), assignTicket);

router.route('/:id/priority')
  .put(authorize('admin'), updatePriority);

module.exports = router;
