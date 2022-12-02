const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  deviceKey: String
})

const user = mongoose.model("User", UserSchema, "users");

module.exports = user; 
