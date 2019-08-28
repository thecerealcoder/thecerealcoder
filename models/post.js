var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    name: String,
    body: String,
    date: String,
    thumbnail: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);