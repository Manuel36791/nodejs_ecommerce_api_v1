const mongoose = require("mongoose");

// 1-Create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      large: { type: String },
      medium: { type: String, default: () => this.image.large },
      thumbnail: { type: String, default: () => this.image.large },
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  // return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/uploads/categories/${doc.image}`;
    doc.image = imageUrl;
  }
}

categorySchema.post("init", (doc) => {
    setImageUrl(doc);
});

categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
