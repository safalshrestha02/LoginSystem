const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3600;
const User = require("./model/user");
const bcrypt = require("bcryptjs");
mongoose.connect(
  "mongodb+srv://safal123:safal123@cluster0.yrugcks.mongodb.net/login-system?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  }
);
//routes
// app.use("/", require("./routes/root"));
//serve static files
app.use(express.static(path.join(__dirname, "/public")));

app.use(bodyParser.json());

app.post("/api/register", async (req, res) => {
  const { username, password } = res.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 6) {
    return res.json({ status: "error", error: "passowrd too small" });
  }

  console.log(await bcrypt.hash(plainTextPassword, 10));

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("user created successfully: ", response);
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key
      return res.json({ status: "error", err: "Username already in use" });
    }
    throw err;
  }

  res.json({ status: "ok" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
