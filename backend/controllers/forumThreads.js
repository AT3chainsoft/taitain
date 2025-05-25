const asyncHandler = require('express-async-handler');
const ForumThread = require('../models/ForumThread');
const ForumPost = require('../models/ForumPost');
const ForumCategory = require('../models/ForumCategory');

// @desc    Get all forum threads
// @route   GET /api/forum/threads
// @access  Public
exports.getThreads = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Build query
    const queryObj = {};
    
    // Filter by category if provided
    if (req.query.category) {
      const category = await ForumCategory.findOne({ slug: req.query.category });
      if (category) {
        queryObj.category = category._id;
      }
    }
    
    // Search functionality
    if (req.query.search) {
      queryObj.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Execute query with pagination
    const threads = await ForumThread.find(queryObj)
      .populate({
        path: 'author',
        select: 'email'
      })
      .populate({
        path: 'category',
        select: 'name slug'
      })
      .sort({ isPinned: -1, lastPostAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count for pagination
    const total = await ForumThread.countDocuments(queryObj);
    
    // Get post count for each thread
    const threadsWithStats = await Promise.all(
      threads.map(async (thread) => {
        const postCount = await ForumPost.countDocuments({ 
          thread: thread._id,
          isDeleted: false 
        });
        
        return {
          ...thread.toObject(),
          postCount
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: threadsWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve threads'
    });
  }
});

// @desc    Get a specific thread with posts
// @route   GET /api/forum/threads/:id
// @access  Public
exports.getThread = asyncHandler(async (req, res) => {
  try {
    // Find thread and increment view count
    const thread = await ForumThread.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
    .populate({
      path: 'author',
      select: 'email'
    })
    .populate({
      path: 'category',
      select: 'name slug'
    });
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    // Get posts with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    const posts = await ForumPost.find({
      thread: thread._id,
      isDeleted: false
    })
      .populate({
        path: 'author',
        select: 'email'
      })
      .sort({ createdAt: 1 })
      .skip(startIndex)
      .limit(limit);
    
    // Get total posts count
    const total = await ForumPost.countDocuments({
      thread: thread._id,
      isDeleted: false
    });
    
    res.status(200).json({
      success: true,
      data: {
        thread,
        posts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve thread'
    });
  }
});

// @desc    Create a new thread
// @route   POST /api/forum/threads
// @access  Private
exports.createThread = asyncHandler(async (req, res) => {
  try {
    const { title, content, categoryId } = req.body;
    
    // Check if category exists
    const category = await ForumCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }
    
    // Create thread
    const thread = await ForumThread.create({
      title,
      content,
      author: req.user.id,
      category: categoryId
    });
    
    await thread.populate({
      path: 'author',
      select: 'email'
    });
    
    await thread.populate({
      path: 'category',
      select: 'name slug'
    });
    
    res.status(201).json({
      success: true,
      data: thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create thread'
    });
  }
});

// @desc    Update a thread
// @route   PUT /api/forum/threads/:id
// @access  Private
exports.updateThread = asyncHandler(async (req, res) => {
  try {
    const { title, content } = req.body;
    
    let thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    // Check if user is thread author or admin
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this thread'
      });
    }
    
    // Check if thread is locked
    if (thread.isLocked && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot update a locked thread'
      });
    }
    
    thread.title = title;
    thread.content = content;
    await thread.save();
    
    await thread.populate({
      path: 'author',
      select: 'email'
    });
    
    await thread.populate({
      path: 'category',
      select: 'name slug'
    });
    
    res.status(200).json({
      success: true,
      data: thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update thread'
    });
  }
});

// @desc    Delete a thread
// @route   DELETE /api/forum/threads/:id
// @access  Private
exports.deleteThread = asyncHandler(async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    // Check if user is thread author or admin
    if (thread.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this thread'
      });
    }
    
    // Delete all posts in thread
    await ForumPost.updateMany(
      { thread: thread._id },
      { isDeleted: true }
    );
    
    // Remove thread
    await thread.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete thread'
    });
  }
});

// @desc    Toggle thread pin status
// @route   PATCH /api/forum/threads/:id/pin
// @access  Private/Admin
exports.togglePinThread = asyncHandler(async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    thread.isPinned = !thread.isPinned;
    await thread.save();
    
    res.status(200).json({
      success: true,
      data: thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update thread pin status'
    });
  }
});

// @desc    Toggle thread lock status
// @route   PATCH /api/forum/threads/:id/lock
// @access  Private/Admin
exports.toggleLockThread = asyncHandler(async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    thread.isLocked = !thread.isLocked;
    await thread.save();
    
    res.status(200).json({
      success: true,
      data: thread
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update thread lock status'
    });
  }
});
