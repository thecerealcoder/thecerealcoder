var express = require("express"),
    router = express.Router(),
    moment = require("moment"),
    Post = require("../models/post"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");
multer = require('multer');
cloudinary = require('cloudinary');

var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

cloudinary.config({
    cloud_name: 'thecerealcoder',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


//New post route
router.get("/new", middleware.isAdmin, (req, res) => {
    res.render("posts/new");
});

//Create new post
router.post("/", middleware.isAdmin, upload.single('image'), middleware.postValidate, (req, res) => {
    cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        var name = req.body.name,
            body = req.body.body,
            image = result.secure_url,
            imageId = result.public_id
        createdAt = new Date(),
            date = moment().format("MMMM Do, YYYY");

        var newPost = { name: name, body: body, image: image, imageId: imageId, createdAt: createdAt, date: date };

        Post.create(newPost, (err, post) => {
            if (err) {
                req.flash("error", err.message);
                return res.redirect('back');
            } else {
                res.redirect("/");
            }
        });
    });
});

//Show posts
router.get("/:slug", middleware.findPost, (req, res) => {
    var perPage = 3;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;

    Post
        .findOne({ slug: req.params.slug })
        .skip((perPage * pageNumber) - perPage)
        .limit(perPage)
        .sort({ createdAt: "descending" })
        .populate({ path: "comments" })
        .exec((err, post) => {
            if (err) {
                req.flash("error", "Post not found!");
                res.redirect("back");
            } else {
                Comment.count({ _id: { $in: req.post.comments } }, (err, count) => {
                    if (err) {
                        req.flash("error", err.message);
                        return res.redirect('back');
                    } else {
                        res.render("posts/show", { post: post, moment: moment, current: pageNumber, pages: Math.ceil(count / perPage) });
                    }
                });
            }
        });
});

//Edit form route
router.get("/:slug/edit", middleware.isAdmin, (req, res) => {
    Post.findOne({ slug: req.params.slug }, (err, post) => {
        if (err) {
            req.flash("error", err.message);
            return res.redirect('back');
        } else {
            res.render("posts/edit", { post: post });
        }
    });
});

//Update post
router.put("/:slug", upload.single('image'), (req, res) => {

    Post.findOne({ slug: req.params.slug }, async (err, post) => {
        if (err) {
            res.redirect("/");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(post.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    post.imageId = result.public_id;
                    post.image = result.secure_url;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            post.name = req.body.post.name;
            post.body = req.body.post.body;

            post.save((err) => {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect('back');
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
            req.flash("error", err.message);
            return res.redirect('back');
        } else {
            Post.findOneAndDelete({ slug: req.params.slug }, async (err, post) => {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect('back');
                } else {
                    try {
                        await cloudinary.v2.uploader.destroy(post.imageId);
                        req.flash('success', 'Post deleted successfully!');
                        res.redirect('/');
                    } catch (err) {
                        if (err) {
                            req.flash("error", err.message);
                            return res.redirect("back");
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;