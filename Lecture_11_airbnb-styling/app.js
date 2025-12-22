//Core module 
const path = require("path");

//Local Module
const userRouter = require("./routes/userRouter");
const hostRouter = require("./routes/hostRouter");
const rootPath = require('./utils/pathutil');


//External Module
const express = require("express");

const app = express();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(express.urlencoded());
app.use(userRouter);
app.use("/host", hostRouter);
app.use(express.static(path.join(rootPath,'public')));

app.use((req, resp, next) => {
  resp.sendFile(path.join(rootPath, "views", "404.html"));
});
