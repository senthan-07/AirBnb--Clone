const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const UserController = require("../controllers/user.js");


router.route("/signup")
.get(UserController.RenderSignupForm)
.post(wrapAsync (UserController.signup));


router.route("/login")
.get(UserController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),UserController.login);
 
//Even to logout we use passport
router.get("/logout",UserController.logout)


module.exports = router;