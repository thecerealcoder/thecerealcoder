var express = require("express"),
    router = express.Router({ mergeParams: true }),
    Post = require("../models/post"),
    Comment = require("../models/comment");
middleware = require("../middleware");



//Post Comment
router.post("/", middleware.isLoggedIn, middleware.commentValidate, (req, res) => {

    Post.findById(req.params.id, (err, post) => {
        if (err || !post) {
            req.flash("error", "Post not found!");
            res.redirect("/");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Error creating comment!");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    post.save();
                    req.flash("success", "Successfully added comment!");
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    });
});

//Update Comment
router.put("/:comment_id", middleware.checkCommentOwnership, middleware.commentValidate, (req, res) => {

    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updateComment) => {
        if (err || !updateComment) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment!");
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            req.flash("error", "Comment not found!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment successfully deleted!");
            res.redirect("/posts/" + req.params.id);
        }
    });
});

module.exports = router;
