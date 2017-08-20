// all the middleware goes here
var Discussion = require("../models/discussion");
var Comment = require("../models/comment");
var User    = require("../models/user");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Discussion.findById(req.params.id, function(err, foundDiscussion){
           if(err){
               req.flash("Discussion not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundDiscussion.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "Permission Denied");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.requireAdmin = function(req, res, next){
    if (req.isAuthenticated()){
        User.findById(req.params.id, function(err, foundAdmin) {
            if(err){
                res.redirect("/login");
            }
            //if the user is admin
            if (req.user.role ==="admin"){
                next()
            }else{
                req.flash("error", "permission denied");
                res.redirect("/login");
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}




middlewareObj.checkCommentOwnership = function(req, res, next) {
 if(req.isAuthenticated()){//check if any user is logged in first
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res , next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


// middlewareObj.requireAdmin = function(req, res, next){
//     if (req.isAuthenticated && user.role==="admin"){
//         return next();
//     }
//     res.redirect("/login");
// }

// middlewareObj.requiresAdmin = function() {
//   return [
//     ensureLoggedIn('/login'),
//     function(req, res, next) {
//       if (req.body.isAdmin === true && req.isAuthenticated())
//         next();
//       else
//         res.send(401, 'Unauthorized');
//     }
//   ]
// };



module.exports = middlewareObj;