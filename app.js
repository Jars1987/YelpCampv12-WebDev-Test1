//============= Set Up ==============

var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    request               = require("request"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user"),
    seedDB                = require("./seeds");

// =========  Routes Dependecies  ======== 
var indexRoutes = require("./routes/index"),
    campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments");
    

//=========== Config ==============
mongoose.connect("mongodb://localhost:27017/yelp_camp_v11", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
  .then(()=>console.log("connected to DB"))
  .catch((err => console.log("Refuse to connect", err)))

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database   

//Passport Session Config
app.use(require("express-session")({
  secret:"Rusty is cool",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next()
});

//requiring routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
//============== Server Setup ==============
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("The Server has Started!");
});

