const asyncHandler = require('express-async-handler');
const ForumPost = require('../models/ForumPost');
const ForumThread = require('../models/ForumThread');

// @desc    Create a forum post (reply)
// @route   POST /api/forum/threads/:threadId/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    const threadId = req.params.threadId;
    
    // Check if thread exists and isn't locked
    const thread = await ForumThread.findById(threadId);
    
    if (!thread) {
      return res.status(404).json({
        success: false,
        error: 'Thread not found'
      });
    }
    
    if (thread.isLocked) {
      return res.status(400).json({
        success: false,
        error: 'Thread is locked. New replies are not allowed'
      });
    }
    
    // Create post
    const post = await ForumPost.create({
      content,
      author: req.user.id,
      thread: threadId
    });
    
    // Update thread's lastPostAt
    thread.lastPostAt = Date.now();
    await thread.save();
    
    await post.populate({
      path: 'author',
      select: 'email'
    });
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create post'
    });
  }
});

// @desc    Update a forum post
// @route   PUT /api/forum/posts/:id
// @access  Private
exports.updatePost = asyncHandler(async (req, res) => {
  try {
    const { content } = req.body;
    
    let post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post'
      });
    }
    
    // Check if thread is locked
    const thread = await ForumThread.findById(post.thread);
    
    if (thread.isLocked && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Cannot update a post in a locked thread'
      });
    }
    
    post.content = content;
    await post.save();
    
    await post.populate({
      path: 'author',
      select: 'email'
    });
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update post'
    });
  }
});

// @desc    Delete a forum post
// @route   DELETE /api/forum/posts/:id
// @access  Private
exports.deletePost = asyncHandler(async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Check if user is post author or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post'
      });
    }
    
    // Instead of deleting, mark as deleted
    post.isDeleted = true;
    post.content = 'This post has been deleted';
    await post.save();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete post'
    });
  }
});

// @desc    Vote on a post
// @route   POST /api/forum/posts/:id/vote
// @access  Private
exports.votePost = asyncHandler(async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['upvote', 'downvote', 'unvote'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type'
      });
    }
    
    const post = await ForumPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    
    // Handle the different vote types
    const userId = req.user.id;
    
    if (voteType === 'upvote') {
      // Remove from downvotes if present
      if (post.downvotes.includes(userId)) {
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
      }
      
      // Add to upvotes if not already there
      if (!post.upvotes.includes(userId)) {
        post.upvotes.push(userId);
      }
    } else if (voteType === 'downvote') {
      // Remove from upvotes if present
      if (post.upvotes.includes(userId)) {
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      }
      
      // Add to downvotes if not already there
      if (!post.downvotes.includes(userId)) {
        post.downvotes.push(userId);
      }
    } else if (voteType === 'unvote') {
      // Remove from both upvotes and downvotes
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId);
    }
    
    await post.save();
    
    res.status(200).json({
      success: true,
      data: {
        voteCount: post.upvotes.length - post.downvotes.length,
        upvotes: post.upvotes.length,
        downvotes: post.downvotes.length,
        userVote: post.upvotes.includes(userId) ? 'upvote' : post.downvotes.includes(userId) ? 'downvote' : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to vote on post'
    });
  }
});
