const mongoose = require('mongoose');
const ForumCategory = require('../models/ForumCategory');
require('dotenv').config();

mongoose.set('strictQuery', false);

const initForumCategories = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully');

    // Check if we already have categories
    const count = await ForumCategory.countDocuments();
    
    if (count > 0) {
      console.log(`Found ${count} existing categories. Skipping initialization.`);
      mongoose.connection.close();
      return;
    }

    // Define initial categories
    const initialCategories = [
      {
        name: 'General Discussion',
        description: 'General discussions about Titan Staking and cryptocurrency.',
        icon: 'ChatBubbleLeftRightIcon',
        order: 1
      },
      {
        name: 'Staking Strategies',
        description: 'Discuss different staking strategies and share your experiences.',
        icon: 'CurrencyDollarIcon',
        order: 2
      },
      {
        name: 'Technical Support',
        description: 'Get help with technical issues related to the platform.',
        icon: 'QuestionMarkCircleIcon',
        order: 3
      },
      {
        name: 'Announcements',
        description: 'Official announcements from the Titan Staking team.',
        icon: 'MegaphoneIcon',
        order: 4
      },
      {
        name: 'Referral Program',
        description: 'Discussion about the referral program and strategies.',
        icon: 'UserGroupIcon',
        order: 5
      }
    ];

    // Insert categories
    const result = await ForumCategory.insertMany(initialCategories);
    console.log(`Created ${result.length} initial forum categories.`);

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error initializing forum categories:', error);
    process.exit(1);
  }
};

initForumCategories();
