var express = require("express");
var router  = express.Router({mergeParams: true});//mergeparam to remove null error
var Appointment = require("../models/appointment");
var Reply = require("../models/reply");
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

//comments NEW
router.get("/new",middleware.isLoggedIn, function(req, res){
    // find appointment by id
    Appointment.findById(req.params.id, function(err, appointment){
        if(err){
            console.log(err);
        } else {
             res.render("reply/new", {discussion: appointment});
        }
    })
});

//Comments create
router.post("/",middleware.isLoggedIn, function(req, res){
   //lookup appointment using ID
   Appointment.findById(req.params.id, function(err, appointment){
       if(err){
           console.log(err);
           res.redirect("/appointment");
       } else {
        Reply.create(req.body.reply, function(err, reply){
           if(err){
               req.flash("error", "Something went wrong")
               console.log(err);
           } else {
               //before pushing the reply. add username and id to the reply
               reply.author.id = req.user._id;
               reply.author.username = req.user.username;
               reply.save();
               appointment.reply.push(reply);
               appointment.save();
               req.flash("success", "Successfully added reply");
               res.redirect('/appointment/' + appointment._id);
           }
        });
       }
   });
   //create new reply
   //connect new reply to appointment
   //redirect appointment show page
});

//comments edit route
router.get("/:reply_id/edit", middleware.checkReplyOwnership, function(req, res){
    Reply.findById(req.params.reply_id, function(err, foundComment){
       if (err){
           res.redirect("back");
       } else {
           res.render("reply/edit",{appointment_id: req.params.id, reply: foundComment});
       }
    });
});

//comments update route
router.put("/:reply_id",middleware.checkReplyOwnership, function(req, res){
    Reply.findByIdAndUpdate(req.params.reply_id, req.body.reply, function(err, updatedComments){
        if (err){
            res.redirect("back");
        } else {
            res.redirect("/appointment/" + req.params.id);
        }
    });
});

//DESTROY COMMENT ROUTE

router.delete("/:reply_id", middleware.checkReplyOwnership, function(req, res) {
    Reply.findByIdAndRemove(req.params.reply_id, function (err){
        if (err){
            res.redirect("back");
        } else {
            req.flash("success", "Reply deleted");
            res.redirect("/appointment/"+ req.params.id);
        }
    });
});

module.exports = router;