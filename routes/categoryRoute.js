const express = require('express');
const categoryService = require('../services/categoryService');
const subCategoryRoute = require('./subCategoryRoute');
const {
  getCategoryByIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const router = express.Router();

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(categoryService.getCategories)
  .post(
    categoryService.uploadCategoryImage,
    categoryService.resizeImage,
    createCategoryValidator,
    categoryService.createCategory
  );
router
  .route("/:id")
  .get(getCategoryByIdValidator, categoryService.getCategoryById)
  .put(
    categoryService.uploadCategoryImage,
    categoryService.resizeImage,
    updateCategoryValidator,
    categoryService.updateCategory
  )
  .delete(deleteCategoryValidator, categoryService.deleteCategory);


module.exports = router;
