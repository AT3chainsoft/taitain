const mongoose = require('mongoose');
require('dotenv').config();
const ForumCategory = require('./models/ForumCategory');
const slugify = require('slugify');

async function setupForumData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully to MongoDB');

    // Check if categories exist
    const count = await ForumCategory.countDocuments();
    
    if (count > 0) {
      console.log(`Found ${count} existing categories. No need to create defaults.`);
    } else {
      console.log('No categories found. Creating default forum categories...');
      
      // Create default categories
      const categories = [
        {
          name: 'General Discussion',
          description: 'Talk about anything related to Titan platform',
          icon: 'ChatBubbleLeftRightIcon',
          order: 1,
          slug: slugify('General Discussion', { lower: true })
        },
        {
          name: 'Staking Strategies',
          description: 'Share and discuss staking strategies',
          icon: 'CurrencyDollarIcon',
          order: 2,
          slug: slugify('Staking Strategies', { lower: true })
        },
        {
          name: 'Technical Support',
          description: 'Get help with technical issues',
          icon: 'QuestionMarkCircleIcon',
          order: 3,
          slug: slugify('Technical Support', { lower: true })
        },
        {
          name: 'Platform Announcements',
          description: 'Official announcements from the Titan team',
          icon: 'MegaphoneIcon',
          order: 4,
          slug: slugify('Platform Announcements', { lower: true })
        }
      ];
      
      await ForumCategory.insertMany(categories);
      console.log('Default forum categories created successfully!');
    }
    
    console.log('Forum setup complete');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up forum data:', error);
    process.exit(1);
  }
}

setupForumData();
