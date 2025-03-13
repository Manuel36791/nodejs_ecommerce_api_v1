const slugify = require("slugify");
const {check, body} = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Category = require("../../models/categoryModel");
const SubCategory = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({min: 3})
    .withMessage("Title must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, {req}) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({max: 2000})
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({max: 32})
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, {req}) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors should be array of string"),
  check("coverImage").notEmpty().withMessage("Product cover image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),

  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid subcategory ID formate")
    .custom((subcategoryIds) =>
      SubCategory.find({_id: {$exists: true, $in: subcategoryIds}}).then(
        (result) => {
          if (result.length < 1 || result.length !== subcategoryIds.length) {
            return Promise.reject(new Error(`Invalid subcategory Ids`));
          }
        }
      )
    )
    // Custom validation to ensure subcategories belong to the specified category
    .custom((val, {req}) =>
      SubCategory.find({category: req.body.category}).then(
        (subcategories) => {
          // Extract subcategory IDs from database results
          const subCategoryIdsInDB = subcategories.map((subCategory) => subCategory._id.toString());

          // Verify that all provided subcategory IDs exist in the database
          const checker = (target, arr) => target.every((v) => arr.includes(v));
          if (!checker(val, subCategoryIdsInDB)) {
            return Promise.reject(
              new Error(`Subcategories don't belong to this category`)
            );
          }
        }
      )
    ),

  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({min: 1})
    .withMessage("Rating must be above or equal 1.0")
    .isLength({max: 5})
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number").custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
  }),

  validatorMiddleware,
];

exports.getProductByIdValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  body("title")
    .optional()
    .custom((val, {req}) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
