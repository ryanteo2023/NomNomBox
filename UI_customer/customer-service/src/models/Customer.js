const mongoose = require('mongoose');

const dietaryPreferenceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['VEGETARIAN', 'VEGAN', 'PESCATARIAN', 'KETO', 'PALEO', 'NONE'],
    default: 'NONE'
  },
  allergies: [String],
  restrictions: [String],
  preferences: {
    spiceLevel: {
      type: Number,
      min: 0,
      max: 5,
      default: 2
    },
    cuisinePreferences: [String],
    dislikedIngredients: [String]
  }
});

const customerSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  dietaryPreferences: {
    type: dietaryPreferenceSchema,
    default: () => ({})
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
customerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Customer', customerSchema); 