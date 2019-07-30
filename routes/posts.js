var express     = require("express");
    router      = express.Router();
    passport    = require("passport");
    moment      = require("moment"),
    User        = require("../models/user");
    Post        = require("../models/post");
    Comment     = require("../models/comment");
    //middleware  = require("../middleware");

//Create new post
router.post("/", (req,res) => {
    var name = req.body.name,
        body = req.body.body,
        date = moment().format("MMMM Do YYYY");

    var newPost = {name:name, body:body, date:date};

    Post.create(newPost, (err, post) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//New post route
router.get("/new", (req,res) => {
    res.render("posts/new");
});

//Show posts
router.get("/:id", (req,res) => {
    Post.findById(req.params.id).populate("comments").exec((err,post) => {
        if(err) {
           req.flash("error", "Post not found!");
           res.redirect("back");
        } else {
            res.render("posts/show", {post:post, moment:moment});
        }
    });
});

//Edit form route
router.get("/:id/edit", (req,res) => {
    Post.findById(req.params.id, (err, post) => {
        res.render("posts/edit", {post: post});
    });
});

//Update post
router.put("/:id", (req,res) => {
    
    req.body.post.date = moment().format("MMMM Do YYYY");
    
    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if(err){
            res.redirect("/");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//Destroy Post
router.delete("/:id", (req,res) => {
    Post.findByIdAndRemove(req.params.id, (err, post) => {
        if(err) {
            res.redirect("/");
        } else {
            Comment.deleteMany({_id: {$in: post}}, (err) => {
                if (err) {
                    res.redirect("/");
                } else {
                    res.redirect("/");
                }
            });
        }
    });
});

module.exports = router;