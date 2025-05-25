const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/forumCategories');

const {
  getThreads,
  getThread,
  createThread,
  updateThread,
  deleteThread,
  togglePinThread,
  toggleLockThread
} = require('../controllers/forumThreads');

const {
  createPost,
  updatePost,
  deletePost,
  votePost
} = require('../controllers/forumPosts');

const { setupForumCategories } = require('../controllers/forumSetup');

// Categories routes
router
  .route('/categories')
  .get(getCategories)
  .post(protect, authorize('admin'), createCategory);

router
  .route('/categories/:id')
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

router.route('/categories/:slug').get(getCategory);

// Threads routes
router
  .route('/threads')
  .get(getThreads)
  .post(protect, createThread);

router
  .route('/threads/:id')
  .get(getThread)
  .put(protect, updateThread)
  .delete(protect, deleteThread);

router
  .route('/threads/:id/pin')
  .patch(protect, authorize('admin'), togglePinThread);

router
  .route('/threads/:id/lock')
  .patch(protect, authorize('admin'), toggleLockThread);

// Posts routes
router.route('/threads/:threadId/posts').post(protect, createPost);

router
  .route('/posts/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/posts/:id/vote').post(protect, votePost);

// Forum setup route
router.route('/setup').post(protect, authorize('admin'), setupForumCategories);

module.exports = router;
