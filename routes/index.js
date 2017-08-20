var express     = require("express");
var router      = express.Router();
var passport    = require("passport");
var User        = require("../models/user");
var Doctor      = require("../models/doctor");
var middleware  = require("../middleware");


router.get("/", function(req, res){
    res.render("landing");
});


//==========================
//      AUTH ROUTES
//==========================

//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User(
        {
        username: req.body.username, 
        role: req.body.role, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        //avatar: req.body.avatar
        });
    if(req.body.adminCode === 'secretcode123'){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Online Consultation System "+ user.username);
           res.redirect("/"); 
        });
    });
});


//Login Route
//show login form
router.get("/login", function(req, res){
    res.render("login");
})


//handle login logic
//app.post("/login", middleware, callback)
// router.post("/login",passport.authenticate("local", //passport uses a middleware to authenticate the username and password
//     {
//         successRedirect:"/",
//         failureRedirect:"/login"
//     }), function(req, res){
// });

router.post("/login", function (req, res, next){
   passport.authenticate("local", function(err, user){
       if (err){
            return next(req.flash("error", err));
       }
       if (!user){
            return res.redirect("/login");
       }
       req.login (user, function(err){
           if(err){
               return next(err);
           }
            if (user.isAdmin===true){
               return res.render("admins");
           }
          if (req.doctor){
              return res.render("doctors/index")
          }
           return res.redirect("/")
       });
   })(req, res, next);
});

//handle login for doctors
//app.post("/login", middleware, callback)
// router.post("/login",passport.authenticate("local", //passport uses a middleware to authenticate the username and password
//     {
//         successRedirect:"/",
//         failureRedirect:"/login"
//     }), function(req, res){
// });
 router.post("/login", passport.authenticate("doctor", 
        {
            successRedirect:"/",
            failureRedirect:"/login",
        }), function(req, res){
 });


//logout route
router.get("/logout", function(req,res){
   req.logout();
   req.flash("success", "Logged you out");
   res.redirect("/");
});

//User Profile
router.get("/users/:id", function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        if (err){
            req.flash("error", "Couldnt find profile");
            res.redirect("/");
        }
        res.render("users/show", {user: foundUser});
    });
});

module.exports = router;