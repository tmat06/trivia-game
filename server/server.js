const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { SERVER_PORT } = process.env;

const app = express();

app.use(bodyParser.json());

app.listen(SERVER_PORT, () =>
  console.log(`Magic happens on Port: ${SERVER_PORT}`)
);
