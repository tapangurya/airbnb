//! ================== CORE MODULES ==================
const path = require("path");
require("dotenv").config();
//! ================== EXTERNAL MODULES ==================
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require('multer');

//! ================== LOCAL MODULES ==================
const userRouter = require("./routes/userRouter");
const { adminRouter } = require("./routes/adminRouter");
const superAdminRout = require("./routes/superAdminRouter");
const { authRouter } = require("./routes/authRouter");
const { superAuthRouter } = require("./routes/superAuthRouter");
const rootPath = require("./utils/pathutil");
const connectDB = require("./utils/databaseutil");
const { pageNotFound } = require("./Controller/404");

//! ================== APP INIT ==================
const app = express();
const PORT = process.env.PORT || 3000;

//! ================== VIEW ENGINE ==================
app.set("view engine", "ejs");
app.set("views", "views");

// !================== SESSION STORE ==================
const mongoUrl = process.env.DB_URL;
if (!mongoUrl) {
  throw new Error("DB_URL is not defined in environment variables");
}


//! File or Photo Upload
//* create a random photo name because of avoid the duplicate or make unique name for each photo name 
const randomString =(length)=>{
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result ='';
  for(let i=0;i<length;i++){
    result +=characters.charAt(Math.floor(Math.random()*characters.length));
  }
  return result;
}
//* where you want to save the photo in server side (folder name "homesImages")
const storage =multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"homesImages");
  },
  filename:(req,file,cb)=>{
    cb(null,randomString(5)+'_'+file.originalname);
  }
})
//* Filter the file whether the uploaded file is jpeg or jpg or png or not if not 
const fileFilter =(req,file,cb)=>{
  if(['image/jpeg','image/jpg','image/png'].includes(file.mimetype)){
    cb(null,true);
  }
  else{
    cb(null,false);
  }
}

const multerOptions = {
  storage,
  fileFilter
}

//! ================== GLOBAL MIDDLEWARE ==================
//* add multer for handling the multipart/form-data
//* here imageUrl is the name of field which was i used or define in Home model 
app.use(multer(multerOptions).single('imageUrl'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootPath, "public")));
app.use("homesImages/",express.static(path.join(rootPath, "homesImages")));
app.use("/Admin/homesImages/",express.static(path.join(rootPath, "homesImages")));
// app.use("/Admin/edit-home/homesImages/",express.static(path.join(rootPath, "homesImages")));
// app.use("/home/homesImages/",express.static(path.join(rootPath, "homesImages")));
app.use("/homesImages/",express.static(path.join(rootPath, "homesImages")));

//! ================== SESSION MIDDLEWARE (BEFORE ROUTES) ==================
const store = new MongoDBStore({
  uri: mongoUrl,
  collection: "sessions",
});
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
}))

//! ================== LOGIN STATUS MIDDLEWARE ==================
app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn || false;
  next();
});
app.use((req, res, next) => {
  req.isSuperAdminLoggedIn = req.session.isSuperAdminLoggedIn ||false;
  next();
});


//! ================== ROUTES ==================

app.use(authRouter);
app.use("/SuperAdmin",superAuthRouter);
app.use(userRouter);
app.use("/SuperAdmin", superAdminRout);

//! ================== SUPER ADMIN AUTH GUARD ==================
app.use("/SuperAdmin", (req, res, next) => {
  // Allow login & signup without authentication
  if (
    req.path === "/super-login" ||
    req.path === "/super-signup"
  ) {
    return next();
  }

  // Check super admin session
  if (
    req.session &&
    req.session.isSuperAdminLoggedIn &&
    req.session.superAdmin
  ) {
    return next();
  }

  // Not authorized
  return res.redirect("/SuperAdmin/super-login");
});
//! ================== ADMIN AUTH GUARD ==================
app.use("/admin", (req, res, next) => {
  if (req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});
app.use("/admin", adminRouter);

//! ================== 404 HANDLER ==================
app.use(pageNotFound);

//! ================== DB CONNECT & SERVER START ==================
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err);
  });
