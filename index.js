var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require("passport");
const upload = require("./multer");

const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login', {error: req.flash("error")});
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn, upload.single("file"), async function(req, res, next) {
    if(!req.file){
        return res.status(404).send("No files were uploaded");
    }
    const user = await userModel.findOne({username: req.session.passport.user});
    const postd = await postModel.create({
        image: req.file.filename,
        imageText: req.body.caption,
        user: user._id
     });

    console.log(user);
    console.log(postd);
    user.post.push(postd._id);
    res.send("done");
});

router.get("/profile", isLoggedIn, async function(req, res, next){
    const user = await userModel.findOne({
      username: req.session.passport.user
    });
    res.render("profile", {user});
});

router.post("/register", function(req, res, next){
    let userdata = new userModel({
      username : req.body.username,
      fullname : req.body.fullname,
      email : req.body.email
    });
    userModel.register(userdata, req.body.password)
    .then(function(registeruser){
      passport.authenticate("local")(req, res, function(){
        res.redirect("/profile");
      })
    });
});

router.post("/login", passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect: "/login",
  failureFlash: true
}), function(req, res, next){});

router.get("/logout", function(req, res, next){
    req.logOut(function(err){
      if(err) return next(err);
      res.redirect("/login");
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
