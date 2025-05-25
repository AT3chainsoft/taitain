const mongoose = require('mongoose');
const slugify = require('slugify');

const ForumThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a thread title'],
    trim: true,
    maxlength: [200, 'Thread title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide thread content'],
    trim: true
  },
  slug: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumCategory',
    required: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  lastPostAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from title
ForumThreadSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true }) + '-' + Date.now().toString().slice(-6);
  }
  next();
});

// Virtual for posts
ForumThreadSchema.virtual('posts', {
  ref: 'ForumPost',
  localField: '_id',
  foreignField: 'thread',
  justOne: false
});

// Virtual for post count
ForumThreadSchema.virtual('postCount', {
  ref: 'ForumPost',
  localField: '_id',
  foreignField: 'thread',
  count: true
});

module.exports = mongoose.model('ForumThread', ForumThreadSchema);
