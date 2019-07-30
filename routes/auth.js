var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
const { check, validationResult } = require('express-validator');


//Register Form
router.get("/register", (req, res) => {
    if (req.user) {
        req.flash("error", "You are already logged in, you cannot register.");
        return res.redirect("back");
    }
    res.render("authorization/register");
});

//Register User
router.post("/register", middleware.toLowerCase,

    check("username")
        .isLength({ min: 4, max: 15 }).withMessage("Username must be between 4-15 characters.")
        .isAlphanumeric().withMessage("Username must be alphanumeric and cannot contain any special characters.")
        .trim().escape(),

    check("password")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
        .trim().escape(),

    check("email")
        .isEmail().withMessage("Email must be valid and of correct format (jane@doe.com).")
        .trim().normalizeEmail(),

    (req, res) => {
        var errors = validationResult(req).array();
        if (errors.length > 0) {
            var messages = "";
            var errnum = 1;
            errors.forEach((error) => {
                messages += ("(" + errnum + ") ");
                messages += error.msg;
                messages += " ";
                errnum ++;
            });
            req.flash("error", messages);
            return res.redirect("/register");
        }
        console.log(req.body.username);
        var newUser = new User({ username: req.body.username, email: req.body.email });

        User.register(newUser, req.body.password, (err, user) => {
            if (err) {
                req.flash("error", err.message);
                res.redirect("/register");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("success", "Welcome to the blog " + user.username + "!");
                    res.redirect("/");
                });
            }
        });
    });

router.post("/login", middleware.toLowerCase,

check("username").trim().escape(),

check("password").escape(),


passport.authenticate("local",
    {
        failureRedirect: "/",
        failureFlash: "Invalid username or password."
    }), (req, res) => {
        req.flash("success", "Welcome back " + req.body.username + "!");
        res.redirect("back");
    });

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out!");
    res.redirect("/");
});

module.exports = router;