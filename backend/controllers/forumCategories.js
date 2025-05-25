const asyncHandler = require('express-async-handler');
const ForumCategory = require('../models/ForumCategory');
const ForumThread = require('../models/ForumThread');

// @desc    Get all forum categories
// @route   GET /api/forum/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
  try {
    console.log('API: Getting forum categories');
    const categories = await ForumCategory.find({ isActive: true })
      .sort({ order: 1 })
      .select('name description icon slug');

    console.log(`Retrieved ${categories.length} categories`);
    
    // Get thread counts for each category
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const threadCount = await ForumThread.countDocuments({ category: category._id });
        return {
          ...category.toObject(),
          threadCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve forum categories'
    });
  }
});

// @desc    Get a specific forum category with its threads
// @route   GET /api/forum/categories/:slug
// @access  Public
exports.getCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ForumCategory.findOne({ slug: req.params.slug, isActive: true });
    
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Get threads in category
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Query for threads
    const threadsQuery = ForumThread.find({ category: category._id })
      .populate({
        path: 'author',
        select: 'email'
      })
      .sort({ isPinned: -1, lastPostAt: -1 })
      .skip(startIndex)
      .limit(limit);
      
    // Execute query
    const threads = await threadsQuery;

    // Get total threads count for pagination
    const total = await ForumThread.countDocuments({ category: category._id });

    res.status(200).json({
      success: true,
      data: {
        category,
        threads,
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
      error: 'Failed to retrieve category'
    });
  }
});

// @desc    Create a new forum category
// @route   POST /api/forum/categories
// @access  Private/Admin
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    const category = await ForumCategory.create({
      name,
      description,
      icon: icon || 'ChatBubbleLeftRightIcon',
      order: order || 0
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Category with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create forum category'
    });
  }
});

// @desc    Update a forum category
// @route   PUT /api/forum/categories/:id
// @access  Private/Admin
exports.updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;

    const category = await ForumCategory.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        description, 
        icon, 
        order,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update forum category'
    });
  }
});

// @desc    Delete a forum category
// @route   DELETE /api/forum/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ForumCategory.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Check if category has threads
    const threadCount = await ForumThread.countDocuments({ category: category._id });
    
    if (threadCount > 0) {
      // Instead of deleting, we'll set it as inactive
      category.isActive = false;
      await category.save();
      
      return res.status(200).json({
        success: true,
        data: {},
        message: 'Category deactivated as it contains threads'
      });
    }
    
    await category.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete forum category'
    });
  }
});
