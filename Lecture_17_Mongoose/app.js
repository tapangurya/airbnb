// Core module
const path = require("path");

// Local modules
const userRouter = require("./routes/userRouter");
const { adminRouter } = require("./routes/adminRouter");
const rootPath = require("./utils/pathutil");
const { pageNotFound } = require("./Controller/404");

// External modules
const express = require("express");
const  connectDB  = require("./utils/databaseutil");


const app = express();
const PORT = 3000;
// View engine
app.set("view engine", "ejs");
app.set("views", "views");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(rootPath, "public")));

// Routes
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(pageNotFound);

// 🔥 Connect DB FIRST, then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
