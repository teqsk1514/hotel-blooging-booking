var express = require("express");
var router = express.Router();
var passport = require("passport");
var Booking = require("../models/booking");
var midddleware = require("../middleware");
var User = require("../models/user");

//Root route 
router.get("/", function (req, res) {
    res.render("landing");
});
//SHOW REGISTER FORM
router.get("/register", function (req, res) {
    res.render("register");
});

// show booking information

router.get('/booked', midddleware.isLoggedIn, (req, res) => {
    Booking.find({ 'author.username': req.user.username }, (err, found) => {
        if (err) {
            console.log(err);
            res.redirect("/hotels");
        }
        else {
            console.log(req.user.username);
            console.log(found.length);
            res.render('booking/booked', { user: req.user.username, bookingDetails: found, len: found.length });
        }
    });

});
//handles signup logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("register");
        }
        else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to LakeSide :" + user.username);
                res.redirect("/hotels");
            });
        }
    });
});


// router.post("/login", function (req, res) {
//     var newUser = new User({ username: req.body.username });
//     User.register(newUser, req.body.password, function (err, user) {
//         if (err) {
//             req.flash("error", err.message);
//             res.redirect("register");
//         }
//         passport.authenticate("local")(req, res, function () {
//             req.flash("success", "Welcome to LakeSide :" + user.username);
//             res.redirect("/hotels");
//         });
//     });
// });


// Show login form
router.get("/login", function (req, res) {
    res.render("login");
});

// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect: "/hotels",
//         failureRedirect: "/login",
//     }), function (req, res) {
//         // req.flash("success", "Welcome to LakeSide :" + user.username);
//         // res.redirect("/hotels");
//     });
router.post("/login", passport.authenticate("local",
    {
        failureRedirect: "/login",
        failureFlash: true
    }), function (req, res) {
        // if (req.body.username == "admin") {
        //     res.redirect("/admin");
        // }
        req.flash('Username or password is incorrect');
        req.flash("success", "Welcome to LakeSide :" + req.body.username);
        // console.log(User.schema);
        res.redirect("/hotels");
    });

router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/hotels");
});
module.exports = router;