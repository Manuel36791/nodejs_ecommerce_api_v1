const express = require("express");
const brandService = require("../services/brandService");
const {
  getBrandByIdValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const router = express.Router();

router
  .route("/")
  .get(brandService.getBrands)
  .post(
    brandService.uploadBrandImage,
    brandService.resizeImage,
    createBrandValidator, brandService.createBrand,
  );

router
  .route("/:id")
  .get(getBrandByIdValidator, brandService.getBrandById)
  .put(
    brandService.uploadBrandImage,
    brandService.resizeImage,
    updateBrandValidator,
    brandService.updateBrand
  )
  .delete(deleteBrandValidator, brandService.deleteBrand);

module.exports = router;
