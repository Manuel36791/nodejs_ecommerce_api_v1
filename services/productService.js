const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const multer = require("multer");
const slugify = require("slugify");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Not an image! Please upload only images."), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

module.exports = {
  uploadProductImages: upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),

  resizeProductImages: asyncHandler(async (req, res, next) => {
    // Image proccessing for coverImage
    if (req.files.coverImage) {
      // prodcut-name-id-Date.now().webp
       const coverImageFilenameLarge = `productCoverImage-${slugify(req.body.title, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
       const coverImageFilenameMedium = `medium-productCoverImage-${slugify(req.body.title, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;
       const coverImageFilenameThumbnail = `thumbnail-productCoverImage-${slugify(req.body.title, { lower: true })}-${uuidv4()}-${Date.now()}.webp`;

      const outputDir = path.join("uploads", "products");

      // Ensure the `uploads/products` directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      await sharp(req.files.coverImage[0].buffer)
        .resize(600, 600)
        .webp({ quality: 80 })
        .toFile(`uploads/products/${coverImageFilenameLarge}`);

      await sharp(req.files.coverImage[0].buffer)
        .resize(300, 300)
        .webp({ quality: 80 })
        .toFile(`uploads/products/${coverImageFilenameMedium}`);

      await sharp(req.files.coverImage[0].buffer)
        .resize(150, 150)
        .webp({ quality: 80 })
        .toFile(`uploads/products/${coverImageFilenameThumbnail}`);

      req.body.coverImage = {
        large: `${coverImageFilenameLarge}`,
        medium: `${coverImageFilenameMedium}`,
        thumbnail: `${coverImageFilenameThumbnail}`,
      };
    }
    next();
  }),

  // @desc     Create Product
  // @route    POST  /api/v1/products
  // @access   Private
  createProduct: factory.createOne(Product),

  // @desc     Get list of all Products
  // @route    GET  /api/v1/products
  // @access   Public
  getProducts: factory.getAll(Product, "Product"),

  // @desc     Get single Product by id
  // @route    GET  /api/v1/products/:id
  // @access   Public
  getProductById: factory.getOne(Product),

  // @desc     Update Product
  // @route    PUT  /api/v1/products/:id
  // @access   Private
  updateProduct: factory.updateOne(Product),

  // @desc     Delete Product
  // @route    DELETE  /api/v1/products/:id
  // @access   Private
  deleteProduct: factory.deleteOne(Product),
};
