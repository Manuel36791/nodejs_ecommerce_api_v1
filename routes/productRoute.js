const express = require("express");
const productService = require("../services/productService");

const {
  getProductByIdValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const router = express.Router();

router
  .route("/")
  .get(productService.getProducts)
  .post(
    productService.uploadProductImages,
    productService.resizeProductImages,
    createProductValidator, productService.createProduct,);
router
  .route("/:id")
  .get(getProductByIdValidator, productService.getProductById)
  .put(updateProductValidator, productService.updateProduct)
  .delete(deleteProductValidator, productService.deleteProduct);

module.exports = router;
