var mongoose = require("mongoose");
var passortLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    avatar:String,
    firstName: String,
    username: String,
    lastName:String,
    password: String,
    email: String,
    role: String,
    isAdmin:{
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model("User", UserSchema);