const mongoose = require("mongoose");

const dbConnection = () => {
  // Connect to MongoDB
mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
    })
    /* .catch((err) => {
    console.error(`Database Error: ${err}`);
    process.exit(1);
    }); */
};

module.exports = dbConnection;
