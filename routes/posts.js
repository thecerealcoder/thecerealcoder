var express = require("express"),
    router = express.Router(),
    moment = require("moment"),
    Post = require("../models/post"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");

//Create new post
router.post("/", middleware.isAdmin, middleware.postValidate, (req, res) => {
    var name = req.body.name,
        body = req.body.body,
        thumbnail = req.body.thumbnail,
        date = moment().format("MMMM Do, YYYY");

    var newPost = { name: name, body: body, thumbnail: thumbnail, date: date };

    Post.create(newPost, (err, post) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/");
        }
    });
});

//New post route
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("posts/new");
});

//Show posts
router.get("/:slug", middleware.findPost, (req, res) => {
    var perPage = 3;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Post
        .findOne({slug: req.params.slug})
        .populate({
            path: "comments",
            options: {
                skip: ((perPage * pageNumber) - perPage),
                limit: perPage,
                sort: { date: "descending"  }
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

    req.body.post.date = moment().format("MMMM Do YYYY");

    Post.findOne({slug: req.params.slug}, (err, post) => {
        if (err) {
            res.redirect("/");
        } else {
            post.name = req.body.post.name;
            post.body = req.body.post.body;
            post.date = req.body.post.date;
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