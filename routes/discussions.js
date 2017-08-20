var express = require("express");
var router = express.Router();
var Discussion = require("../models/discussion");
var middleware = require("../middleware");



//INDEX - show all discussions posts  --main pag
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Discussion.find({}, function(err, allDiscussions){
       if(err){
           console.log(err);
       } else {
          res.render("discussions/index",{discussions:allDiscussions, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB 
router.post("/", middleware.isLoggedIn, function(req, res){
    
    // get data from form and add to discussions array
    var name = req.body.name;
    //var image = req.body.image;
    var desc = req.body.description;
    var author={
                id: req.user._id,
                username: req.user.username
                } //create an object
    var newDiscussion = {name: name, description: desc, author: author}
    // Create a new discussion and save to DB
    Discussion.create(newDiscussion, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            req.flash("success", "New Campground Successfully Created")
            //redirect back to discussion page
            res.redirect("/discussions");
        }
    });
});

//NEW - show form to create new discussion
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("discussions/new"); 
});

// SHOW - shows more info about one discussions
router.get("/:id", function(req, res){
    //find the cdiscussions with provided ID
    Discussion.findById(req.params.id).populate("comments").exec(function(err, foundDiscussion){
        if(err){
            console.log(err);
        } else {
            console.log(foundDiscussion)
            //render show template with that discussion
            res.render("discussions/show", {discussion: foundDiscussion});
        }
    });
});

//EDIT DISCUSSIONS ROUTE - FORM and need update to submit the form
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    //check is someone logged in at all?
    Discussion.findById(req.params.id, function(err, foundDiscussion){
        res.render("discussions/edit", {discussion: foundDiscussion});
    });
});

//UPDATE DISCUSSIONS ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function (req, res){
    //find and update discussion
    Discussion.findByIdAndUpdate(req.params.id, req.body.discussion, function(err, updatedDiscussion){//id, the data u wanna update, and callback function
        if (err){
            res.redirect("/discussions");
        } else{
            //redirect to the show page
            res.redirect("/discussions/"+ req.params.id);
        }
    });
});

//DESTROY DISCUSSION ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Discussion.findByIdAndRemove(req.params.id, function(err){
       if (err){
           res.redirect("/discussions");     
         } else {
             req.flash("succes", "Discussion: " + Discussion.name + " Successfully Deleted");
             res.redirect("/discussions");
         }
    });
});


//only allow a logged in user to add a comment 
//middelware




// function checkCampgroundOwnership (req, res, next){
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