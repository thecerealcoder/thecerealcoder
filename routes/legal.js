var express = require("express"),
    router = express.Router();

router.get("/terms", (req, res) => {
    res.render("legal/terms");
});

router.get("/privacy", (req, res) => {
    res.render("legal/privacy");
});

module.exports = router;