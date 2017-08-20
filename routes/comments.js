var express = require("express");
var router  = express.Router({mergeParams: true});//mergeparam to remove null error
var Discussion = require("../models/discussion");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

//comments NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find discussion by id
    Discussion.findById(req.params.id, function(err, discussion){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {discussion: discussion});
        }
    })
});

//Comments create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup discussion using ID
   Discussion.findById(req.params.id, function(err, discussion){
       if(err){
           console.log(err);
           res.redirect("/discussions");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong")
               console.log(err);
           } else {
               //before pushing the comment. add username and id to the comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               comment.save();
               discussion.comments.push(comment);
               discussion.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/discussions/' + discussion._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to discussion
   //redirect discussion show page
});

//comments edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
       if (err){
           res.redirect("back");
       } else {
           res.render("comments/edit",{discussion_id: req.params.id, comment: foundComment});
       }
    });
});

//comments update route
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComments){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/discussions/" + req.params.id);
        }
    });
});

//DESTROY COMMENT ROUTE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function (err){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/discussions/"+ req.params.id);
        }
    });
});

module.exports = router;