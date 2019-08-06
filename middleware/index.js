// all middleware
var Comment = require("../models/comment");
const { check, validationResult } = require('express-validator');

var middlewareObj = {};

middlewareObj.toLowerCase = (req, res, next) => {
    req.body.username = req.body.username.toLowerCase();
    next();
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
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

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("back");
}

middlewareObj.commentValidate = [
    check("comment[text]")
        .isLength({ min: 1, max: 1000 }).withMessage("Comment must be between 1-1000 characters.")
        .escape(),

    (req, res, next) => {
        var errors = validationResult(req).array(),
            messages = "Error: ";

        if (errors.length > 0) {
            errors.forEach((error) => {
                messages += error.msg;
                messages += " ";
            });

            req.flash("error", messages);
            return res.redirect("back");
        }
        next();
    }
];

middlewareObj.regValidate = [
    check("username")
        .isLength({ min: 4, max: 15 }).withMessage("Username must be between 4-15 characters.")
        .isAlphanumeric().withMessage("Username must be alphanumeric and cannot contain any special characters.")
        .trim().escape()
        .custom(username => {
            return User.findOne({ username: username }).then(username => {
                if (username) {
                    return Promise.reject("A user with the given username is already registered.");
                }
            });
        }),

    check("email")
        .isEmail().withMessage("Email must be valid and of correct format (jane@doe.com).")
        .trim().normalizeEmail()
        .custom(email => {
            return User.findOne({ email: email }).then(email => {
                if (email) {
                    return Promise.reject("A user with the given email is already registered.");
                }
            });
        }),


    check("password")
        .isLength({ min: 8, max: 128 }).withMessage("Password must be at least 8 characters.")
        .escape(),

        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += " ";
                });
    
                req.flash("error", messages);
                return res.redirect("back");
            }
            next();
        }
];

middlewareObj.loginValidate = [
    check("username").trim().escape(),
    check("password").escape(),
    (req,res,next) => {
        next();
    }
];


module.exports = middlewareObj;