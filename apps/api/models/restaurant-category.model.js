const { Schema, model } = require('mongoose');

const RestaurantCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
  },
});

module.exports = model('RestaurantCategory', RestaurantCategorySchema);
