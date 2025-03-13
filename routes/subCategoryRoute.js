const express = require("express");
const {
  createSubCategory,
  getSubCategoryById,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryByIdValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

// mergeParams => Allow us to access parameters from other routes
const router = express.Router({
  mergeParams: true,
});

router
  .route("/")
  .get(createFilterObject, getSubCategories)
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryByIdValidator, getSubCategoryById)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
