const {check} = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryByIdValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("subcategory name required")
    .isLength({min: 3})
    .withMessage("Too short subcategory name")
    .isLength({max: 32})
    .withMessage("Too long subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("Subcategory must belong to a category")
    .isMongoId()
    .withMessage("Invalid category id format").custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  check("name").custom((val, {req}) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid subcategory id format"),
  validatorMiddleware,
];
