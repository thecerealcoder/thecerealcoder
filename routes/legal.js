var express = require("express"),
    router = express.Router();

//Get Terms of Use
router.get("/terms", (req, res) => {
    res.render("legal/terms");
});

//Get Privacy Policy
router.get("/privacy", (req, res) => {
    res.render("legal/privacy");
});

module.exports = router;