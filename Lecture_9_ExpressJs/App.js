const express = require("express");
const app = express();
const PORT = 3000;

app.use((req, resp, next) => {
  console.log("Came in first middleware: ", req.url, req.method);

  next();
});

app.use((req, resp, next) => {
  console.log("Came in second middleware: ", req.url, req.method);
  resp.send("<h1>Welcome to Express js</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
