const multer = require("multer");
const ApiError = require("../utils/apiError");


/// Disk storage
/* const multerStorage = multer.diskStorage( {
  destination: (req, file, cb) => {
    cb(null, "uploads/categories");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    // category-${id}-Date.now().ext
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
}); */

exports.uploadSingleImage = (fieldName) => {
  /// Memory storage
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Not an image! Please upload only images."), false);
    }
  };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
    
  return upload.single(fieldName);
};
