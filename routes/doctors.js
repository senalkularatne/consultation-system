var express = require("express");
var router = express.Router();
var Doctor    = require("../models/doctor");
var User    = require("../models/user");
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res){
          User.findById(req.user._id, function(err, user){
              if (user.role==="doctor"){
                  res.render("doctors/index");
              } 
              else{
                  res.redirect("/")
              }
          });
});

router.get('/view', function(req, res) {
  User.find({ role: '' },function (err, todos, count) {
    if (err){
           req.flash("error","unable to load profile");
           res.redirect("/");
       } 
       else
       {   
           res.render("doctors/view", { todos : todos });

       }
    
    
  });
});



// router.get("/view", function(req, res){
//    User.findById(req.params.id, function(err, foundUser){
//        if (err){
//            req.flash("error","unable to load profile");
//            res.redirect("/");
//        } 
//        else
//        {
//            res.render("doctors/view"); 

//        }
//     });
// });

router.get("/profile/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
       if (err){
           req.flash("error","unable to load profile");
           res.redirect("/");
       } 
       else
       {
           res.render("doctors/profile", {User: foundUser}); 

       }
    });
});    

module.exports = router;