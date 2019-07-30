var express     = require("express");
    router      = express.Router();
    //middleware  = require("../middleware");

//Get posts from DB
router.get("/", (req,res) => {
     Post.find({}).sort({date: "descending"}).exec((err, allPosts) => {
        if(err){
            console.log(err);
        } else {
            res.render("posts/index", {posts:allPosts});
        }
    });
});

module.exports = router;