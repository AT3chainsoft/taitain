const asyncHandler = require('express-async-handler');
const ForumCategory = require('../models/ForumCategory');
const slugify = require('slugify');

// @desc    Initialize forum categories
// @route   POST /api/forum/setup
// @access  Private/Admin
exports.setupForumCategories = asyncHandler(async (req, res) => {
  try {
    // Check if we already have categories
    const count = await ForumCategory.countDocuments();
    
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `Found ${count} existing categories. Skipping initialization.`
      });
    }

    // Define initial categories
    const initialCategories = [
      {
        name: 'General Discussion',
        description: 'General discussions about Titan Staking and cryptocurrency.',
        icon: 'ChatBubbleLeftRightIcon',
        order: 1,
        slug: slugify('General Discussion', { lower: true })
      },
      {
        name: 'Staking Strategies',
        description: 'Discuss different staking strategies and share your experiences.',
        icon: 'CurrencyDollarIcon',
        order: 2,
        slug: slugify('Staking Strategies', { lower: true })
      },
      {
        name: 'Technical Support',
        description: 'Get help with technical issues related to the platform.',
        icon: 'QuestionMarkCircleIcon',
        order: 3,
        slug: slugify('Technical Support', { lower: true })
      },
      {
        name: 'Announcements',
        description: 'Official announcements from the Titan Staking team.',
        icon: 'MegaphoneIcon',
        order: 4,
        slug: slugify('Announcements', { lower: true })
      },
      {
        name: 'Referral Program',
        description: 'Discussion about the referral program and strategies.',
        icon: 'UserGroupIcon',
        order: 5,
        slug: slugify('Referral Program', { lower: true })
      }
    ];

    // Insert categories
    const result = await ForumCategory.insertMany(initialCategories);
    
    res.status(200).json({
      success: true,
      data: result,
      message: `Created ${result.length} initial forum categories.`
    });
  } catch (error) {
    console.error('Error initializing forum categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize forum categories'
    });
  }
});
