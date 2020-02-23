var express = require("express");
var passport = require("passport");
var User = require("../models/user");
var router = express.Router();

router.get("/", function(req, res) {
    res.render("home.ejs");
});

router.get("/register", function(req, res) {
    res.render("register.ejs");
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/" + user._id + "/projects/");
            })
        }
    })
});

router.get("/login", function(req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/" ,
    failureRedirect: "/login"
}), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;