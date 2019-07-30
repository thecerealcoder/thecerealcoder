var express            = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      flash            = require("connect-flash"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      User             = require("./models/user"),
      methodOverride   = require("method-override"),
      expressSession   = require("express-session"),
      seedDB           = require("./seeds");

//Declaring routes for Router pkg config
var indexRoutes         = require("./routes/index"),
    authRoutes          = require("./routes/auth"),
    postRoutes          = require("./routes/posts"),
    commentRoutes       = require("./routes/comments");
    

//More setup stuff

seedDB();
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/thecerealcoder", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended:true}));
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

app.use((req,res,next) => {
    res.locals.currentUser= req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Router pkg setup
app.use(indexRoutes);
app.use(authRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
//app.use("/:id/comments", commentRoutes);


//Listen for port
app.listen(3000, () => {
    console.log("App Successfully Running");
});