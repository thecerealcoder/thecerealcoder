var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    expressSession = require("express-session");

//Declaring routes for Router pkg config
var indexRoutes = require("./routes/index"),
    authRoutes = require("./routes/auth"),
    aboutRoutes = require("./routes/about"),
    postRoutes = require("./routes/posts"),
    legalRoutes = require("./routes/legal"),
    commentRoutes = require("./routes/comments");


//More setup stuff
var url = process.env.DATABASEURL || "mongodb://localhost/test";

mongoose.set('useFindAndModify', false);
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("Error:", err.message);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


//Passport config
app.use(expressSession({
    secret: "Shhhhh",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Setting up res.locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Router pkg setup
app.use(indexRoutes);
app.use(authRoutes);
app.use("/legal", legalRoutes);
app.use("/about", aboutRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:slug/comments", commentRoutes);

//Listen for port
app.listen(process.env.PORT || 3000, () => {
    console.log("App Successfully Running");
});