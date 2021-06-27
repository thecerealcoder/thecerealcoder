var express = require("express"),
	router = express.Router(),
	nodemailer = require("nodemailer"),
	middleware = require("../middleware"),
	he = require("he");

//Get about index
router.get("/", (req, res) => {
	res.render("about/index");
});

//Post route for sending contact inquiry
router.post("/", middleware.contactValidate, (req, res) => {
	var smtpTransport = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: "thecerealcoder@gmail.com",
			pass: process.env.GMAILPW,
		},
	});

	var mailOptions = {
		to: "thecerealcoder@gmail.com",
		from: "thecerealcoder@gmail.com",
		subject: "Contact Inquiry",
		text: "Name: " + req.body.name + "\n" + "Email: " + req.body.email + "\n\n" + he.decode(req.body.message.text),
	};
	smtpTransport.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		}
		smtpTransport.close();
		console.log("mail sent");
		req.flash("success", "Your message has been sent!");
		res.redirect("/about");
	});
});

module.exports = router;
