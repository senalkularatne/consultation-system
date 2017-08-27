var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({
   name: String,
   image: String,
   doc_id: String,
   use_id: String,
   date: String,
   time: String,
   reason: String,
   description: String,
   createdAt: {
      type: Date,
      default:Date.now
   },
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   reply: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Reply"
      }
   ]
});

module.exports = mongoose.model("Appointment", appointmentSchema);