const mongoose = require("mongoose");

// 1-Create schema
const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Brand name is required"],
      unique: [true, "Brand name must be unique"],
      minlength: [3, "Too short brand name"],
      maxlength: [32, "Too long brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      large: { type: String, required: true },
      medium: { type: String, default: () => this.image.large },
      thumbnail: { type: String, default: () => this.image.large },
    },
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  // return image base url + image name
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/uploads/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});

// 2- Create model
const BrandModel = mongoose.model("Brand", brandSchema);

module.exports = BrandModel;
