const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      unique: [true, "Product title must be unique"],
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
      min: [0, "Quantity can not be negative"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
      required: [true, "Product price is required"],
      min: [0, "Price can not be negative"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      default: 0,
      min: [0, "Price after discount can not be negative"],
      trim: true,
    },
    colors: [String],
    coverImage: {
      large: {
        type: String,
        required: [true, "Product cover image is required"],
      },
      medium: { type: String, default: () => this.coverImage.large },
      thumbnail: { type: String, default: () => this.coverImage.large },
    },
    images: [
      {
        large: {
          type: String,
        },
        medium: { type: String, default: () => this.image.large },
        thumbnail: { type: String, default: () => this.image.large },
      },
    ],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    rating: {
      rate: {
        type: Number,
        default: 0,
        min: [0, "Rating can not be negative"],
        max: [5, "Rating can not be more than 5.0"],
        set: (v) => Math.round(v * 10) / 10,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate(["category", "subcategories", "brand"]);
  next();
});

productSchema.pre("save", function (next) {
  this.populate(["category", "subcategories", "brand"]);
  next();
});

module.exports = mongoose.model("Product", productSchema);
