import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Listing from './api/models/listing.model.js';
import User from './api/models/user.model.js';

dotenv.config();

const dummyListings = [
  {
    name: 'Modern Luxury Villa with Pool',
    description: 'A stunning modern luxury villa featuring a private swimming pool, spacious garden, and contemporary architecture.',
    address: '108 Palm Avenue, Beverly Hills, CA',
    regularPrice: 4500,
    discountPrice: 3800,
    bathrooms: 4,
    bedrooms: 5,
    furnished: true,
    parking: true,
    type: 'rent',
    offer: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Cozy Downtown Modern Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown with breathtaking skyline views, fully furnished kitchen.',
    address: '42 Main Street, Manhattan, NY',
    regularPrice: 2800,
    discountPrice: 2500,
    bathrooms: 2,
    bedrooms: 2,
    furnished: true,
    parking: true,
    type: 'rent',
    offer: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Elegant Family Beachfront House',
    description: 'Charming beachfront house with direct access to sandy beaches. Perfect place for quiet living and vacations.',
    address: '77 Ocean Drive, Miami Beach, FL',
    regularPrice: 750000,
    discountPrice: 690000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: false,
    parking: true,
    type: 'sale',
    offer: true,
    imageUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Spacious Suburban Family Home',
    description: 'Wonderful single-family home with huge backyard, attached garage, and newly renovated wooden interiors.',
    address: '512 Oakwood Lane, Austin, TX',
    regularPrice: 480000,
    discountPrice: 450000,
    bathrooms: 3,
    bedrooms: 4,
    furnished: true,
    parking: true,
    type: 'sale',
    offer: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
    ],
  },
  {
    name: 'Minimalist Penthouse with City Terrace',
    description: 'Exclusive top-floor penthouse with private terrace, modern smart home features, and panoramic city views.',
    address: '900 Sky Tower, Chicago, IL',
    regularPrice: 3200,
    discountPrice: 3000,
    bathrooms: 2,
    bedrooms: 3,
    furnished: true,
    parking: false,
    type: 'rent',
    offer: false,
    imageUrls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB for seeding...');

    // Purani listings ko saaf karke fresh data daalna
    await Listing.deleteMany({});

    const user = await User.findOne();
    if (!user) {
      console.log('Pehle ek user create kijiye website par!');
      process.exit();
    }

    const listingsWithUser = dummyListings.map((item) => ({
      ...item,
      userRef: user._id.toString(),
    }));

    await Listing.insertMany(listingsWithUser);
    console.log('🎉 Fresh listings successfully add ho gayi hain!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();