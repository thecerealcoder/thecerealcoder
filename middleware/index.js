// all middleware
var Post = require("../models/post");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.toLowerCase = (req,res,next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
}

middlewareObj.checkCommentOwnership = (req,res,next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in first!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("/login");
}

module.exports = middlewareObj;