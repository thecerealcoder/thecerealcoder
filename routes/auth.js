var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    Comment = require("../models/comment"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto"),
    middleware = require("../middleware");


//Register Form
router.get("/register", middleware.loggedIn, (req, res) => {
    res.render("authorization/register");
});

//Register User
router.post("/register", middleware.toLowerCase, middleware.regValidate, (req, res) => {

    var newUser = new User({ username: req.body.username, email: req.body.email });

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", "Error: " + err.message + ".");
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                req.flash("success", "Welcome to the blog, " + user.username + "!");
                res.redirect("/");
            });
        }
    });
});

//Login Form
router.get("/login", middleware.loggedIn, (req, res) => {
    res.render("authorization/login");
});


//Login User
router.post("/login", middleware.loggedIn, middleware.toLowerCase, middleware.loginValidate, middleware.authenticate, (req, res, next) => {
    });


//Logout User
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/");
});

//Destroy user & remove user comments
router.delete("/delete/:user", (req, res) => {
    Comment.remove({ "author.username": req.user.username }, (err) => {
        if (err) {
            console.log(err);
        } else {
            User.findByIdAndRemove(req.user.id, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    req.flash("success", "Successfully deleted user account.");
                    res.redirect("/");
                }
            });
        }
    });
});



//Forgot Password
router.get("/forgot", (req, res, next) => {
    res.render("authorization/forgot");
});

//Post route for sending forgot password email to user
router.post("/forgot", middleware.forgotValidate, (req, res, next) => {
    async.waterfall([
        function(done) {
            crypto.randomBytes(20, function(err, buf) {
                var token = buf.toString("hex");
                done(err, token);
            });
        },
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "thecerealcoder@gmail.com",
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "thecerealcoder@gmail.com",
                subject: "Password Reset",
                text: "You are receiving this because there has been a request for the reset of the password to this account.\n\n" +
                    "Please click on the following link, or paste this into your browser to complete the password reset process:\n\n" +
                    "http://" + req.headers.host + "/reset/" + token + "\n\n" +
                    "If you did not request this, please ignore this email and your password will remain unchanged.\n"
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                smtpTransport.close();
                console.log("mail sent");
                req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
                done(err, "done");
            });
        }
    ], function(err) {
        if (err) return next(err);
        res.redirect("/forgot");
    });
});

//Reset password form
router.get("/reset/:token", function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            req.flash("error", "Password reset token is invalid or has expired.");
            return res.redirect("/forgot");
        }
        res.render("authorization/reset", { token: req.params.token });
    });
});


//Post route to reset user password
router.post("/reset/:token", middleware.resetValidate, function(req, res) {
    async.waterfall([
        function(done) {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
                if (!user) {
                    req.flash("error", "Password reset token is invalid or has expired.");
                    return res.redirect("back");
                }
                user.setPassword(req.body.password, function(err) {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;

                    user.save(function(err) {
                        req.logIn(user, function(err) {
                            done(err, user);
                        });
                    });
                })
            });
        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "thecerealcoder@gmail.com",
                    pass: process.env.GMAILPW
                }
            });
            var mailOptions = {
                to: user.email,
                from: "thecerealcoder@mail.com",
                subject: "Your password has been changed",
                text: "Hello,\n\n" +
                    "This is a confirmation that the password for your account " + user.email + " has just been changed.\n"
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                req.flash("success", "Success! Your password has been changed.");
                done(err);
            });
        }
    ], function(err) {
        res.redirect("/");
    });
});


module.exports = router;