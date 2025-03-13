const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Brand = require("../models/brandModel");
const factory = require("./handlersFactory");
const {
  uploadSingleImage,
} = require("../middlewares/imagePorcessMiddleware");

module.exports = {
  uploadBrandImage: uploadSingleImage("image"),

  resizeImage: asyncHandler(async (req, res, next) => {
    // category-name-id-Date.now().webp
    const filenameLarge = `brand-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
    const filenameMedium = `medium-brand-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
    const filenameThumbnail = `thumbnail-brand-${slugify(req.body.name, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;

    const outputDir = path.join("uploads", "brands");

    // Ensure the `brands/` directory exists
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

  // @desc     Create Brands
  // @route    POST  /api/v1/Brands
  // @access   Private
  createBrand: factory.createOne(Brand),

  // @desc     Get list of all Brands
  // @route    GET  /api/v1/Brands
  // @access   Public
  getBrands: factory.getAll(Brand),

  // @desc     Get single Brands by id
  // @route    GET  /api/v1/Brands/:id
  // @access   Public
  getBrandById: factory.getOne(Brand),

  // @desc     Update Brands
  // @route    PUT  /api/v1/Brands/:id
  // @access   Private
  updateBrand: factory.updateOne(Brand),

  // @desc     Delete Brands
  // @route    DELETE  /api/v1/Brands/:id
  // @access   Private
  deleteBrand: factory.deleteOne(Brand),
};
