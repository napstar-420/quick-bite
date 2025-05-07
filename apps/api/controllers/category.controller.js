const { matchedData } = require('express-validator');

const CategoryModel = require('../models/restaurant-category.model');

async function searchCategories(req, res) {
  const { q } = matchedData(req);

  const categories = await CategoryModel.find({
    name: { $regex: q, $options: 'i' },
  });
  res.json(categories);
}

module.exports = {
  searchCategories,
};
