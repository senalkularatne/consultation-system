var express = require("express");
var router = express.Router();
var Appointment = require("../models/appointment");
var middleware = require("../middleware");
var Doctor    = require("../models/doctor");
var User    = require("../models/user");



//INDEX - show all appointment posts  --main pag
router.get("/", function(req, res){
    // Get all campgrounds from DB
    User.findById(req.user._id, function(err, user){
              if (user.role==="doctor"){
                      Appointment.find({ doc_id: req.user._id  }, function(err, allDiscussions){
                         if(err){
                             console.log(err);
                         } else {
                            res.render("appointment/index",{appointment:allDiscussions, currentUser: req.user});
                         }
                      });
              } 
              else if (user.role===""){
                  Appointment.find({ use_id: req.user._id  }, function(err, allDiscussions){
                         if(err){
                             console.log(err);
                         } else {
                            res.render("appointment/index",{appointment:allDiscussions, currentUser: req.user});
                         }
                      });
              }
              else{
                Appointment.find({}, function(err, allDiscussions){
                         if(err){
                             console.log(err);
                         } else {
                            res.render("appointment/index",{appointment:allDiscussions, currentUser: req.user});
                         }
                      });
              }
    });


});

//CREATE - add new campground to DB 
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form and add to appointment array
    var name = req.body.name;
    //var image = req.body.image;
    var doctor_id = req.body.doctor_id
    var user_id = req.user._id
    var desc = req.body.description;
    var reason = req.body.reason;
    var date = req.body.date;
    var time = req.body.time;
    var author={
                id: req.user._id,
                username: req.user.username
                } //create an object
    var newDiscussion = {name: name,doc_id:doctor_id,use_id:user_id ,date:date,time:time,reason:reason,description: desc, author: author}
    // Create a new discussion and save to DB
    Appointment.create(newDiscussion, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "New Campground Successfully Created")
            //redirect back to discussion page
            res.redirect("/appointment");
        }
    });
});

//NEW - show form to create new discussion
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("appointment/new"); 
});

// SHOW - shows more info about one appointment
router.get("/:id", function(req, res){
    //find the cdiscussions with provided ID
    Appointment.findById(req.params.id).populate("reply").exec(function(err, foundDiscussion){
        if(err){
            console.log(err);
        } else {
            console.log(foundDiscussion)
            //render show template with that discussion
            res.render("appointment/show", {appointment: foundDiscussion});
        }
    });
});

//EDIT DISCUSSIONS ROUTE - FORM and need update to submit the form
router.get("/:id/edit",middleware.checkAppgroundOwnership, function(req, res) {
    //check is someone logged in at all?
    Appointment.findById(req.params.id, function(err, foundDiscussion){
        res.render("appointment/edit", {discussion: foundDiscussion});
    });
});

//UPDATE DISCUSSIONS ROUTE
router.put("/:id",middleware.checkAppgroundOwnership, function (req, res){
    //find and update discussion
    Appointment.findByIdAndUpdate(req.params.id, req.body.discussion, function(err, updatedDiscussion){//id, the data u wanna update, and callback function
        if (err){
            res.redirect("/appointment");
        } else{
            //redirect to the show page
            res.redirect("/appointment/"+ req.params.id);
        }
    });
});

//DESTROY DISCUSSION ROUTE
router.delete("/:id",middleware.checkAppgroundOwnership, function(req, res){
    Appointment.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/appointment");     
         } else {
             req.flash("succes", "Appointment: " + Appointment.name + " Successfully Deleted");
             res.redirect("/appointment");
         }
    });
});


//only allow a logged in user to add a comment 
//middelware




// function checkAppgroundOwnership (req, res, next){
//     if (req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//         if (err){
//             res.redirect("back");
//         } else {
//         // another if statment to check if the user own the campground?
//           if(foundCampground.author.id.equals(req.use._id)){
//                 next();
//           } else {
//                 res.redirect("back");
//           }
//         }
//         });
//     } else{
//         res.redirect("back");
//     }
// }


module.exports = router;