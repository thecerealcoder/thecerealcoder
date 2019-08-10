var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    createdAt: {type:Date, default:Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    replies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            autopopulate: true
        }
    ]
});

commentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model("Comment", commentSchema);

