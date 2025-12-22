//Core module 
const path = require("path");

//Local Module
const userRouter = require("./routes/userRouter");
const {adminRouter} = require("./routes/adminRouter");
const rootPath = require('./utils/pathutil');
const {pageNotFound} = require('./Controller/404');

//External Module
const express = require("express");



const app = express();
app.set('view engine','ejs');
app.set('views','views');
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.urlencoded());
app.use(userRouter);
app.use("/admin", adminRouter);
app.use(express.static(path.join(rootPath,'public')));

app.use(pageNotFound);
