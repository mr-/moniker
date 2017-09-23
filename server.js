const express = require("express");
const fs = require("fs");


const app = express();

app.set("port", process.env.PORT || 3001);

app.use(express.static("build"));

app.get("/api/food", (req, res) => {
  const param = req.query.q;

  if (true) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }

});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
