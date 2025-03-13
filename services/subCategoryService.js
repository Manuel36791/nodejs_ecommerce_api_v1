const SubCategory = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// @desc     Create new subcategory
// @route    POST  /api/v1/subcategory
// @access   Private
exports.createSubCategory = factory.createOne(SubCategory);

// @desc     Nested route
// @route    GET  /api/v1/categories/:categoryId/subcategories
exports.createFilterObject = (req, res, next) => {
  let filerObject = {};

  if (req.params.categoryId) filerObject = {category: req.params.categoryId};

  req.filterObject = filerObject;
  next();
}

// @desc     Get list of all subcategories
// @route    GET  /api/v1/subcategories
// @access   Public
exports.getSubCategories = factory.getAll(SubCategory);

// @desc     Get single subcategory by id
// @route    GET  /api/v1/subcategories/:id
// @access   Public
exports.getSubCategoryById = factory.getOne(SubCategory);

// @desc     Update subcategory
// @route    PUT  /api/v1/subcategories/:id
// @access   Private
exports.updateSubCategory = factory.updateOne(SubCategory);

// @desc     Delete subcategory
// @route    DELETE  /api/v1/subcategories/:id
// @access   Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);

