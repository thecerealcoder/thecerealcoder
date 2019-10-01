var express = require("express"),
    router = express.Router(),
    moment = require("moment"),
    Post = require("../models/post"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");


//New post route
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("posts/new");
});

//Create new post
router.post("/", middleware.isAdmin, middleware.postValidate, (req, res) => {
    var name = req.body.name,
        body = req.body.body,
        thumbnail = req.body.thumbnail,
        createdAt = new Date(),
        date = moment().format("MMMM Do, YYYY");

    var newPost = { name: name, body: body, thumbnail: thumbnail, createdAt: createdAt, date: date };

    Post.create(newPost, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//Show posts
router.get("/:slug", middleware.findPost, (req, res) => {
    var perPage = 3;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Post
        .findOne({slug: req.params.slug})
        .skip((perPage * pageNumber) - perPage)
        .limit(perPage)
        .sort({ createdAt : "descending" })
        .populate({path: "comments"})
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
router.get("/:slug/edit", middleware.isAdmin, (req, res) => {
    Post.findOne({slug: req.params.slug}, (err, post) => {
        if(err) {
            res.redirect("back");
        } else {
            res.render("posts/edit", { post: post }); 
        }
    });
});

//Update post
router.put("/:slug", (req, res) => {

    Post.findOne({slug: req.params.slug}, (err, post) => {
        if (err) {
            res.redirect("/");
        } else {
            post.name = req.body.post.name;
            post.body = req.body.post.body;
            post.thumbnail = req.body.post.thumbnail;

            post.save((err) => {
                if(err) {
                    console.log(err);
                } else {
                    res.redirect("/posts/" + post.slug);
                }
            });
        }
    });
});

//Destroy Post
router.delete("/:slug", middleware.findPost, (req, res) => {
    Comment.remove({ _id: { $in: req.post.comments } }, (err) => {
        if (err) {
            res.redirect("/");
        } else {
            Post.findOneAndRemove(req.params.slug, (err) => {
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