const asyncHandler = require('express-async-handler');
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const NotificationService = require('../utils/notificationService');

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Private
exports.createTicket = asyncHandler(async (req, res) => {
  const { subject, category, priority, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'Please provide a subject and message'
    });
  }

  try {
    const ticket = await Ticket.create({
      userId: req.user.id,
      subject,
      category: category || 'other',
      priority: priority || 'medium',
      replies: [{
        sender: req.user.id,
        senderRole: 'user',
        message
      }]
    });

    await ticket.populate({
      path: 'userId',
      select: 'email'
    });

    // Add notification for the user
    await NotificationService.notifyUser(
      req.user.id,
      'support',
      'Support Ticket Created',
      `Your ticket #${ticket.ticketNumber}: ${ticket.subject} has been created.`,
      ticket._id,
      'Ticket'
    );

    // Add notification for admins
    await NotificationService.notifyAdmins(
      'support',
      'New Support Ticket',
      `New support ticket #${ticket.ticketNumber}: ${ticket.subject}`,
      ticket._id,
      'Ticket'
    );

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create ticket'
    });
  }
});

// @desc    Get all tickets (admin only) or user's tickets
// @route   GET /api/tickets
// @access  Private
exports.getTickets = asyncHandler(async (req, res) => {
  try {
    let query = {};

    // Regular users can only see their own tickets
    if (req.user.role !== 'admin') {
      query.userId = req.user.id;
    }

    // Handle filters
    const { status, category, priority, search } = req.query;
    
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { 'replies.message': { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate({
        path: 'userId',
        select: 'email'
      })
      .populate({
        path: 'assignedTo',
        select: 'email'
      })
      .sort({ lastUpdated: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve tickets'
    });
  }
});

// @desc    Get a single ticket
// @route   GET /api/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'email'
      })
      .populate({
        path: 'assignedTo',
        select: 'email'
      })
      .populate({
        path: 'replies.sender',
        select: 'email'
      });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check if the user has permission to view the ticket
    if (req.user.role !== 'admin' && ticket.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this ticket'
      });
    }

    // Mark ticket as read based on user role
    if (req.user.role === 'admin' && !ticket.isRead) {
      ticket.isRead = true;
      await ticket.save();
    } else if (req.user.role !== 'admin' && !ticket.userRead) {
      ticket.userRead = true;
      await ticket.save();
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve ticket'
    });
  }
});

// @desc    Add reply to a ticket
// @route   POST /api/tickets/:id/replies
// @access  Private
exports.addReply = asyncHandler(async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check if the user has permission to reply to the ticket
    if (req.user.role !== 'admin' && ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to reply to this ticket'
      });
    }

    // If ticket is closed, it needs to be reopened for new replies
    if (ticket.status === 'closed' || ticket.status === 'resolved') {
      ticket.status = 'open';
    }

    // Add the reply
    const reply = {
      sender: req.user.id,
      senderRole: req.user.role === 'admin' ? 'admin' : 'user',
      message
    };

    ticket.replies.push(reply);

    // Update read status
    if (req.user.role === 'admin') {
      ticket.isRead = true;
      ticket.userRead = false; // User needs to read this new reply
    } else {
      ticket.isRead = false; // Admin needs to read this new reply
      ticket.userRead = true;
    }

    await ticket.save();

    await Ticket.populate(ticket, {
      path: 'replies.sender',
      select: 'email'
    });

    // Add notification based on who replied
    if (req.user.role === 'admin') {
      // Admin replied - notify the user
      await NotificationService.notifyUser(
        ticket.user.toString(),
        'support',
        'Support Ticket Updated',
        `An agent has replied to your ticket #${ticket.ticketNumber}.`,
        ticket._id,
        'Ticket'
      );
    } else {
      // User replied - notify admins
      await NotificationService.notifyAdmins(
        'support',
        'Ticket Reply Received',
        `New reply to ticket #${ticket.ticketNumber} from ${req.user.email}.`,
        ticket._id,
        'Ticket'
      );
    }

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add reply'
    });
  }
});

// @desc    Update ticket status (admin only)
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
exports.updateTicketStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['new', 'open', 'pending', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid status'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    ticket.status = status;
    
    // Add system message about status change
    const statusMessage = `Ticket status changed to ${status}`;
    ticket.replies.push({
      sender: req.user.id,
      senderRole: 'admin',
      message: statusMessage
    });

    ticket.userRead = false; // User should be notified of status change

    await ticket.save();

    await Ticket.populate(ticket, {
      path: 'replies.sender',
      select: 'email'
    });

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket status'
    });
  }
});

// @desc    Assign ticket to admin (admin only)
// @route   PUT /api/tickets/:id/assign
// @access  Private/Admin
exports.assignTicket = asyncHandler(async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an admin ID'
      });
    }

    // Verify that the assignee is an admin
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json({
        success: false,
        error: 'Invalid admin ID'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Update assignment
    ticket.assignedTo = adminId;
    
    // Add system message about assignment
    ticket.replies.push({
      sender: req.user.id,
      senderRole: 'admin',
      message: `Ticket assigned to ${admin.email}`
    });

    await ticket.save();

    await Ticket.populate(ticket, [{
      path: 'assignedTo',
      select: 'email'
    }, {
      path: 'replies.sender',
      select: 'email'
    }]);

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to assign ticket'
    });
  }
});

// @desc    Update ticket priority (admin only)
// @route   PUT /api/tickets/:id/priority
// @access  Private/Admin
exports.updatePriority = asyncHandler(async (req, res) => {
  try {
    const { priority } = req.body;

    if (!priority || !['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid priority'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    ticket.priority = priority;
    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update ticket priority'
    });
  }
});

// @desc    Get ticket statistics (admin only)
// @route   GET /api/tickets/stats
// @access  Private/Admin
exports.getTicketStats = async (req, res) => {
  try {
    // Get total tickets count
    const total = await Ticket.countDocuments();
    
    // Get status counts
    const newTickets = await Ticket.countDocuments({ status: 'new' });
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const pendingTickets = await Ticket.countDocuments({ status: 'pending' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const closedTickets = await Ticket.countDocuments({ status: 'closed' });
    
    // Get priority counts
    const urgentTickets = await Ticket.countDocuments({ priority: 'urgent' });
    const highTickets = await Ticket.countDocuments({ priority: 'high' });
    const mediumTickets = await Ticket.countDocuments({ priority: 'medium' });
    const lowTickets = await Ticket.countDocuments({ priority: 'low' });
    
    // Get other counts
    const unassignedTickets = await Ticket.countDocuments({ assignedTo: null });
    const unreadTickets = await Ticket.countDocuments({ isRead: false });
    
    // Get category counts
    const depositTickets = await Ticket.countDocuments({ category: 'deposit' });
    const withdrawalTickets = await Ticket.countDocuments({ category: 'withdrawal' });
    const stakingTickets = await Ticket.countDocuments({ category: 'staking' });
    const accountTickets = await Ticket.countDocuments({ category: 'account' });
    const referralTickets = await Ticket.countDocuments({ category: 'referral' });
    const technicalTickets = await Ticket.countDocuments({ category: 'technical' });
    const otherTickets = await Ticket.countDocuments({ category: 'other' });
    
    // Get average rating
    let averageRating = { average: 0, count: 0 };
    
    const reviewedTickets = await Ticket.find({ 'review.rating': { $exists: true } });
    if (reviewedTickets.length > 0) {
      const totalRating = reviewedTickets.reduce((sum, ticket) => sum + ticket.review.rating, 0);
      averageRating = {
        average: parseFloat((totalRating / reviewedTickets.length).toFixed(1)),
        count: reviewedTickets.length
      };
    }
    
    return res.status(200).json({
      success: true,
      data: {
        total,
        new: newTickets,
        open: openTickets,
        pending: pendingTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
        urgent: urgentTickets,
        high: highTickets,
        medium: mediumTickets,
        low: lowTickets,
        unassigned: unassignedTickets,
        unread: unreadTickets,
        deposit: depositTickets,
        withdrawal: withdrawalTickets,
        staking: stakingTickets,
        account: accountTickets,
        referral: referralTickets,
        technical: technicalTickets,
        other: otherTickets,
        averageRating
      }
    });
  } catch (error) {
    console.error('Error getting ticket statistics:', error);
    // Return a 200 status with empty stats instead of 500 error
    return res.status(200).json({
      success: true,
      data: {
        total: 0, new: 0, open: 0, pending: 0, resolved: 0, closed: 0,
        urgent: 0, high: 0, medium: 0, low: 0, unassigned: 0, unread: 0,
        deposit: 0, withdrawal: 0, staking: 0, account: 0, 
        referral: 0, technical: 0, other: 0,
        averageRating: { average: 0, count: 0 }
      },
      message: 'Error fetching stats, showing default values'
    });
  }
};

// @desc    Add review to a ticket
// @route   PUT /api/tickets/:id/review
// @access  Private
exports.reviewTicket = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid rating between 0 and 5'
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        error: 'Ticket not found'
      });
    }

    // Check if the user has permission to review the ticket
    if (ticket.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to review this ticket'
      });
    }

    // Check if ticket is resolved or closed
    if (ticket.status !== 'resolved' && ticket.status !== 'closed') {
      return res.status(400).json({
        success: false,
        error: 'Can only review resolved or closed tickets'
      });
    }

    // Add the review
    ticket.review = {
      rating,
      comment: comment || '',
      reviewedAt: Date.now()
    };

    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
});
