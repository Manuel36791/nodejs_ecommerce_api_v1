const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Category = require("../models/categoryModel");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/imagePorcessMiddleware");

module.exports = {
  uploadCategoryImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    // category-name-id-Date.now().webp
     const filenameLarge = `category-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
    const filenameMedium = `medium-category-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
    const filenameThumbnail = `thumbnail-category-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;

    const outputDir = path.join("uploads", "categories");

    // Ensure the `uploads/categories` directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await sharp(req.file.buffer)
      .resize(600, 600)
      .webp({ quality: 80 })
      .toFile(`uploads/brands/${filenameLarge}`);

    await sharp(req.file.buffer)
      .resize(300, 300)
      .webp({ quality: 80 })
      .toFile(`uploads/brands/${filenameMedium}`);

    await sharp(req.file.buffer)
      .resize(150, 150)
      .webp({ quality: 80 })
      .toFile(`uploads/brands/${filenameThumbnail}`);

    req.body.image = {
      large: `${filenameLarge}`,
      medium: `${filenameMedium}`,
      thumbnail: `${filenameThumbnail}`,
    };

    next();
  }),

  // @desc     Create category
  // @route    POST  /api/v1/categories
  // @access   Private
  createCategory: factory.createOne(Category),

  // @desc     Get list of all categories
  // @route    GET  /api/v1/categories
  // @access   Public
  getCategories: factory.getAll(Category),

  // @desc     Get single category by id
  // @route    GET  /api/v1/categories/:id
  // @access   Public
  getCategoryById: factory.getOne(Category),

  // @desc     Update category
  // @route    PUT  /api/v1/categories/:id
  // @access   Private
  updateCategory: factory.updateOne(Category),

  // @desc     Delete category
  // @route    DELETE  /api/v1/categories/:id
  // @access   Private
  deleteCategory: factory.deleteOne(Category),
};
