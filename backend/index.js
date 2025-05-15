const express = require("express");
const app = express();
const { config } = require("dotenv");
const { connectDB } = require("./lib/db");
const AuthRouter = require("./routes/auth.route");
const cookieParser = require("cookie-parser");

config();

app.use(express.json()); //for req.body
app.use(cookieParser()); //for req.cookies
app.use("/auth", AuthRouter);

const PORT = process.env.PORTC || "3000";
app.listen(PORT, () => {
  connectDB();
  console.log("Listening to on port " + PORT);
});
