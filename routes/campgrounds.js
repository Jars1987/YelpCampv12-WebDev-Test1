
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Index -- Show all campgrounds
router.get("/", function(req, res){ 
  //get all campgrounds from DB
  Campground.find({}, function (err, allcampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allcampgrounds});
    }
  });

});


//Create - Add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
//add data from form and add to campgrounds array
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {name: name, price: price, image: image, description: desc, author: author};
 //create a new campground and save it to DB
 Campground.create(newCampground, function(err, newlyCreated){
   if(err){
     console.log(err);
   } else {
     //redirect back to campgrounds page
    res.redirect("/campgrounds");     
   }
 })
});

// New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// Show - show info about one campground
router.get("/:id", function(req, res){
  //find the template with campground ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err || !foundCampground){
      console.log(err);
      req.flash("error", "Sorry, that campground does not exist");
      res.redirect("back");
  } else {
      console.log(foundCampground)
  //render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground})
    };
  });
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
          res.render("campgrounds/edit", {campground: foundCampground});
    });
  });


//UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
  //find and update campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err){
      res.redirect("/");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  })
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
 Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
   if(err){
    console.log(err);
    res.redirect("/campgrounds");
   } else {
    Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, function(err){
      if (err) {
          console.log(err);
      }
      res.redirect("/campgrounds");
      });
    };
 });
});

module.exports = router; 