// Application server

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URL, port } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Fake SO Server Dummy Endpoint");
  res.end();
});
const userController = require("./controller/userController");
const questionController = require("./controller/questionController");
const authController = require("./controller/authentication_middleware");

app.use("./user",authController);
app.use("/user", userController);
app.use("./question",authController);
app.use("/question",questionController);

let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});
