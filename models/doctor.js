var mongoose = require("mongoose");
var passortLocalMongoose = require("passport-local-mongoose");

var DoctorSchema = new mongoose.Schema({
    password: String,
    userName: String,
    idNumber: String,
    avatar:String,
    firstname: String,
    lastName:String,
    email: String,
    role: String,
    type: String
});

DoctorSchema.plugin(passortLocalMongoose);

module.exports = mongoose.model("Doctor", DoctorSchema);