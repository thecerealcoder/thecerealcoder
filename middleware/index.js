// all middleware
var Comment = require("../models/comment"),
    Post = require("../models/post"),
    passport = require("passport"),
    User = require("../models/user");
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
                console.log(err);
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

middlewareObj.authenticate =  (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/",
        successFlash: "Welcome back, " + req.body.username + "!",
        failureRedirect: "back",
        failureFlash: "Invalid username or password."
    }) (req, res, next);
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first!");
    res.redirect("back");
}

middlewareObj.loggedIn = (req, res, next) => {
    if(req.user){
        req.flash("error", "You are already logged in!");
        return res.redirect("/");
    }
    next();
}

middlewareObj.isAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
        if(req.user.isAdmin === true) {
            return next()
        }
    }
    req.flash("error", "You must be an admin to create new posts!");
    res.redirect("back");
}

middlewareObj.findPost = (req, res, next) => {
    Post.findOne({slug: req.params.slug}, (err,foundPost) => {
        if(err) {
            console.log(err);
        } else {
            req.post = foundPost;
            next();
        }
    });
}

middlewareObj.searchValidate = [
    check("search")
    .isLength({min: 1}).withMessage("Enter keywords to search for posts ")
    .escape(),

    (req, res, next) => {
        var errors = validationResult(req).array(),
            messages = "Error: ";

        if (errors.length > 0 && errors[0].value != undefined) {

            errors.forEach((error) => {
                messages += error.msg;
                messages += ". ";
            });

            req.flash("error", messages);
            return res.redirect("back");
        }
        next();
    }
];

middlewareObj.commentValidate = [
    check("comment[text]")
        .isLength({ min: 1, max: 1000 }).withMessage("Comment must be between 1-1000 characters")
        .escape(),

    (req, res, next) => {
        var errors = validationResult(req).array(),
            messages = "Error: ";

        if (errors.length > 0) {
            errors.forEach((error) => {
                messages += error.msg;
                messages += ". ";
            });

            req.flash("error", messages);
            return res.redirect("back");
        }
        next();
    }
];

middlewareObj.postValidate = [
    check("name")
        .isLength({min:1, max: 75}).withMessage("Name must be between 1-75 characters")
        .escape(),

    check("thumbnail")
        .isURL().withMessage("Must have a valid URL for thumbnail"),

        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += ". ";
                });
    
                req.flash("error", messages);
                return res.redirect("back");
            }
            next();
        }  
];

middlewareObj.contactValidate = [
    check("name")
        .isLength({ min: 1, max: 30 }).withMessage("Name must be between 1-30 characters")
        .trim().escape(),

    check("email")
        .isEmail().withMessage("Email must be valid and of correct format (jane@doe.com)")
        .trim().escape().normalizeEmail(),

    check("message[text]")
        .isLength({ min: 1, max: 1000 }).withMessage("Message must be between 1-1000 characters")
        .escape(),
        
        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += ". ";
                });
    
                req.flash("error", messages);
                return res.redirect("back");
            }
            next();
        }
];

middlewareObj.regValidate = [
    check("username")
        .isLength({ min: 4, max: 15 }).withMessage("Username must be between 4-15 characters")
        .isAlphanumeric().withMessage("Username must be alphanumeric and cannot contain any special characters")
        .trim().escape()
        .custom(username => {
            return User.findOne({ username: username }).then(username => {
                if (username) {
                    return Promise.reject("A user with the given username is already registered");
                }
            });
        }),

    check("email")
        .isEmail().withMessage("Email must be valid and of correct format (jane@doe.com)")
        .trim().escape().normalizeEmail()
        .custom(email => {
            return User.findOne({ email: email }).then(email => {
                if (email) {
                    return Promise.reject("A user with the given email is already registered");
                }
            });
        }),


    check("password")
        .isLength({ min: 8, max: 128 }).withMessage("Password must be at least 8 characters")
        .escape()
        .custom(((password, {req}) => {
            if(password !== req.body.confirmPass) {
                throw new Error("Passwords do not match");
            }
            return true;
        })),

        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += ". ";
                });
    
                req.flash("error", messages);
                return res.redirect("back");
            }
            next();
        }
];

middlewareObj.forgotValidate = [

    check("email")
        .isEmail().withMessage("Email must be valid and of correct format (jane@doe.com)")
        .trim().escape().normalizeEmail()
        .custom(email => {
            return User.findOne({ email: email }).then(email => {
                if (!email) {
                    return Promise.reject("No account with the given email address exists");
                }
            });
        }),

        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += ". ";
                });
    
                req.flash("error", messages);
                return res.redirect("back");
            }
            next();
        }
];

middlewareObj.resetValidate = [
    check("password")
        .isLength({ min: 8, max: 128 }).withMessage("Password must be at least 8 characters")
        .equals("confirmPass").withMessage("Passwords do not match")
        .escape(),

        (req, res, next) => {
            var errors = validationResult(req).array(),
                messages = "Error: ";
    
            if (errors.length > 0) {
                errors.forEach((error) => {
                    messages += error.msg;
                    messages += ". ";
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