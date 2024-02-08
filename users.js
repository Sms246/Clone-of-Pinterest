const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pinterest");
const userSchema = new mongoose.Schema({
    username: {
      type: String,
      require: true,
      unique: true
    },
    password: {
      type: String,
      require: true
    },
    post:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'
    }],
    dp: {
      type: String
    },
    email: {
      type: String,
      require: true,
      unique: true
    },
    fullname: {
      type: String,
      require: true
    }
});
userSchema.plugin(plm);
const user = mongoose.model("user", userSchema);
module.exports = user;