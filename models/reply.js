var mongoose = require("mongoose");

var replySchema = mongoose.Schema({
    text: String,
    createdAt: {
      type: Date,
      default:Date.now
   },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:String
    }
});

module.exports = mongoose.model("Reply", replySchema);