const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")


const userController = require("../controllers/user.js")



router
    .route("/signup")
    .get(userController.renderSignup)
    .post(wrapAsync(userController.userSignup))


router
    .route("/login")
    .get(userController.renderUserLogin)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash:true}), userController.userLogin);


router.get("/logout", userController.userLogout);



module.exports = router;
