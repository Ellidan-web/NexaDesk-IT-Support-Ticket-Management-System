const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// User routes
router.post('/', ticketController.createTicket);
router.get('/my', ticketController.getUserTickets);
router.get('/:id', ticketController.getTicketById);
router.patch('/:id/status', ticketController.updateTicketStatus);
router.patch('/:id/priority', ticketController.updateTicketPriority);
router.post('/:id/comments', ticketController.addComment);

// Admin routes
router.get('/admin/all', ticketController.getAllTickets);
router.patch('/admin/:id/assign', ticketController.assignTicket);

module.exports = router;