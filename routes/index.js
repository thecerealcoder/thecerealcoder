var express = require("express"),
    router = express.Router(),
    Post = require("../models/post"),
    middleware = require("../middleware");

//Get posts from DB
router.get("/", middleware.searchValidate, (req, res) => {
    var perPage = 6;
    pageQuery = parseInt(req.query.page),
        pageNumber = pageQuery ? pageQuery : 1;

    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var message = null;

        Post
            .find({ name: regex })
            .skip((perPage * pageNumber) - perPage)
            .limit(perPage)
            .sort({ createdAt : "descending" })
            .exec((err, allPosts) => {
                Post
                    .count({ name: regex })
                    .exec((err, count) => {
                        if (err) {
                            console.log(err);
                            res.redirect("back");
                        } else {
                            message = "Search results for: " + req.query.search;
                            res.render("posts/index", { posts: allPosts, current: pageNumber, pages: Math.ceil(count / perPage), message: message, search: req.query.search });
                        }
                    });
            });

    } else {
        Post
            .find({})
            .skip((perPage * pageNumber) - perPage)
            .limit(perPage)
            .sort({ createdAt: "descending" })
            .exec((err, allPosts) => {
                Post
                    .count()
                    .exec((err, count) => {
                        if (err) {
                            console.log(err);
                            res.redirect("back");
                        } else {
                            res.render("posts/index", { posts: allPosts, current: pageNumber, pages: Math.ceil(count / perPage), message: message, search: false });
                        }
                    });
            });
    }
});

router.get("/sitemap.xml", (req, res) => {
    res.render("/sitemap.xml");
});

router.get("/robots.txt", (req, res) => {
    res.render("/robots.txt");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;