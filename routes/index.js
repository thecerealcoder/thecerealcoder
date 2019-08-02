var express = require("express");
router = express.Router();
//middleware  = require("../middleware");

//Get posts from DB
router.get("/", (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        var message = null;
        Post.find({ name: regex }).sort({ date: "descending" }).exec((err, allPosts) => {
            if (err) {
                console.log(err);
            } else {
                message = "Search results for: \"" + req.query.search + "\"";
                if(allPosts.length === 0) {
                    res.render("posts/index", { posts: allPosts, message: message });
                } else {
                    res.render("posts/index", { posts: allPosts, message: message});
                }
            }
        });
    } else {
        Post.find({}).sort({ date: "descending" }).exec((err, allPosts) => {
            if (err) {
                console.log(err);
            } else {
                res.render("posts/index", { posts: allPosts, message: message });
            }
        });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;