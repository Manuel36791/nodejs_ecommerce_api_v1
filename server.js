const express = require("express");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

// Express app
const app = express();

// Connect to database
dbConnection();

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.all("*", (req, res, next) => {
  next(new ApiError(400, `Route ${req.originalUrl} not found`));
});

// Global error handler middleware for express
app.use(globalError);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handles refections that happens outside express
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Rejection Error: ${error.name} | ${error.message}`);
  server.close(() => {
    console.error("Server is shutting down due to Unhandled Rejection Error");
    process.exit(1);
  });
});
