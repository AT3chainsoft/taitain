const mongoose = require('mongoose');
const slugify = require('slugify');

const ForumCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a category description'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  icon: {
    type: String,
    default: 'ChatBubbleLeftRightIcon'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
ForumCategorySchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Virtual for threads
ForumCategorySchema.virtual('threads', {
  ref: 'ForumThread',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

module.exports = mongoose.model('ForumCategory', ForumCategorySchema);
