var express     = require("express");
var router      = express.Router();
var Doctor      = require("../models/doctor");
var User        = require("../models/user");
var middleware  = require("../middleware");
var passport    = require("passport");



//index route
// router.get("/", middleware.requireAdmin, function(req, res){
//           User.findById(req.user._id, function(err, user){
//               if (user.role==="admin"){
//                   res.render("admins/index");
//               } 
//               if(err){
//                 req.flash("error", "You Do Not Have Permission")
//               }
//               else{
//                   res.redirect("/")
//               }
//           });
// });

//index route
router.get("/", middleware.requireAdmin, function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      res.render("admins", {User:foundUser});
    }
  });
});

//new route to show the add doctor form 
router.get("/new", middleware.requireAdmin, function(req, res){
  res.render("admins/new")
});

//create route -  add new doctor to the user database 
router.post("/", middleware.requireAdmin, function(req, res){
  var newUser = new User ({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    role: req.body.role,
    email: req.body.email,
    //avatar: req.body.avatar,
    idNumber: req.body.idNumber,
    type: req.body.type
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err){
      req.flash("error", "Unable to register new doctor");
      return res.redirect("admins/new");
    }
    else{
      req.flash("success", "New Doctor added to the system");
      return res.redirect("/admins");
    }
  });
});


router.get('/view', middleware.requireAdmin, function(req, res) {
  User.find({ role: 'doctor' },function (err, todos, count) {
    if (err){
           req.flash("error","unable to load profile");
           res.redirect("/");
       } 
       else
       {   
           res.render("admins/view", { todos : todos });

       }
    
    
  });
});

router.get('/allusers', middleware.requireAdmin, function(req, res) {
  User.find({ role: '' },function (err, todos, count) {
    if (err){
           req.flash("error","unable to load profile");
           res.redirect("/");
       } 
       else
       {   
           res.render("admins/allusers", { todos : todos });

       }
    
    
  });
});
// router.post("/", middleware.requireAdmin, function(req, res){
//   // User.findById(req.params.id, function(err, user){
//   //   if (err){
//   //     console.log(err);
//   //   }
//   //   else{
//   Doctor.create(req.body.user, function(err, doctor){
//     if(err){
//       console.log(err);
//     } else {
//     //before pushing the other var. add the username and password to user
//     var user
//     doctor.author.username = req.user.username;
//     doctor.author.password = req.user.password;
//     doctor.author.firstName = req.user.firstName;
//     doctor.author.lastName = req.user.lastName;
//     doctor.author.email = req.user.email;
//     doctor.author.avatar = req.user.avatar;
//     doctor.author.role = req.user.role;
//     doctor.admins.push(doctor);
//     user.save();
//     res.redirect("/admins")
//           }
//         });
//   });

router.get("/", function(req, res){
  
});




// // Create Route to add new Doctor to the database 
// router.post("/", function(req, res){
//   //get data from the form and add to the doctor array
//   var newDoctor = new Doctor({
//         username: req.body.username, 
//         role: req.body.role, 
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         avatar: req.body.avatar
//   });
  
//   Doctor.register(newDoctor, req.body.password, function(err, doctor){
//     if (err){
//       req.flash("error", "unable to sign up");
//       res.redirect("/register")
//       console.log(err);
//     }
//       passport.authenticate("local")(req, res, function(){
//         req.flash("success", "New User Created");
//         res.redirect("/admins"); 
    
//   });
//   });
// });

// //New Route to show the add doctor form
// router.get("/new", middleware.isLoggedIn, function(req, res){
//   res.render("admins/new"); 
// });


module.exports = router;