var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    middleware = require("../middleware");


//Register Form
router.get("/register", (req, res) => {
    if (req.user) {
        req.flash("error", "You are already logged in, you cannot register.");
        return res.redirect("back");
    }
    res.render("authorization/register");
});

//Register User
router.post("/register", middleware.toLowerCase, middleware.regValidate, (req, res) => {

    var newUser = new User({ username: req.body.username, email: req.body.email });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", "Database Error: " + err.message + ".");
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to the blog " + user.username + "!");
                res.redirect("/");
            });
        }
    });
});

router.post("/login", middleware.toLowerCase, middleware.loginValidate,
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