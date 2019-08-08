var express = require("express");
router = express.Router();
passport = require("passport");
moment = require("moment"),
    User = require("../models/user");
Post = require("../models/post");
Comment = require("../models/comment");
middleware = require("../middleware");

//Create new post
router.post("/", (req, res) => {
    var name = req.body.name,
        body = req.body.body,
        date = moment().format("MMMM Do YYYY");

    var newPost = { name: name, body: body, date: date };

    Post.create(newPost, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//New post route
router.get("/new", (req, res) => {
    res.render("posts/new");
});

//Show posts
router.get("/:id", middleware.findPost, (req, res) => {
    var perPage = 3;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Post
        .findById(req.params.id)
        .populate({
            path: "comments",
            options: {
                skip: ((perPage * pageNumber) - perPage),
                limit: perPage,
                sort: { "created_at": -1 }
            }
        })
        .exec((err, post) => {
            if (err) {
                req.flash("error", "Post not found!");
                res.redirect("back");
            } else {
                Comment.count({ _id: { $in: req.post.comments } }, (err, count) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render("posts/show", { post: post, moment: moment, current: pageNumber, pages: Math.ceil(count / perPage) });
                    }
                });
            }
        });
});

//Edit form route
router.get("/:id/edit", (req, res) => {
    Post.findById(req.params.id, (err, post) => {
        res.render("posts/edit", { post: post });
    });
});

//Update post
router.put("/:id", (req, res) => {

    req.body.post.date = moment().format("MMMM Do YYYY");

    Post.findByIdAndUpdate(req.params.id, req.body.post, (err, post) => {
        if (err) {
            res.redirect("/");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//Destroy Post
router.delete("/:id", middleware.findPost, (req, res) => {
    Comment.remove({ _id: { $in: req.post.comments } }, (err) => {
        if (err) {
            res.redirect("/");
        } else {
            Post.findByIdAndRemove(req.params.id, (err) => {
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