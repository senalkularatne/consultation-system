var express = require("express");
var router = express.Router();
var Discussion = require("../models/discussion");
var middleware = require("../middleware");
var User    = require("../models/user");
//var Doctor    = require("../models/doctor");


//index route
router.get("/", middleware.isLoggedIn, function(req, res){
          User.findById(req.user._id, function(err, user){
              if (user.role===""){
                  res.render("patients/index");
              } 
              else{
                  res.redirect("/")
              }
          });
});



router.get('/view', function(req, res) {
  User.find({ role: 'doctor' },function (err, todos, count) {
    if (err){
           req.flash("error","unable to load profile");
           res.redirect("/");
       } 
       else
       {   
           res.render("patients/view", { todos : todos });

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
//            res.render("patients/view"); 

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
           res.render("patients/profile", {User: foundUser}); 

       }
    });
});
    
module.exports = router;


    // User.find({}).exec(function(err, user) {   
    //     if (err) throw err;
    //     res.render('/patients/view', { "User": user });
    // });
