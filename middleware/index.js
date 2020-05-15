var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership =  function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
       //this block is to check if foundCampground exists
        //we had this to avoid someone to change the url && ids making the app to crash
      if(err || !foundCampground){
        req.flash("error", "Campground not found");
        res.redirect("back");
      } else {
         //does user own the campground
         if(foundCampground.author.id.equals(req.user._id)){
          next();
         } else {
          req.flash("error", "You don't have permition to do that");
          res.redirect("back");
         }
      }
  });
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err || !foundComment){
        console.log(err);
        req.flash('error', 'Sorry, that comment does not exist!');
        res.redirect('/campgrounds');
      } else {
         //does user own the comment
         if(foundComment.author.id.equals(req.user._id)){
          next();
         } else {
          req.flash("error", "You don't have permition to do that");
          res.redirect("back");
         }
      }
  });
  } else {
    req.flash("error", "You need to be logged in to do that")
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/login");
};

module.exports = middlewareObj