const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();

const passport = require("passport");
const {saveRedirectUrl} = require("../middlewear.js")

const userController = require("../controllers/users.js");

// render sign Up form
router.get("/signup",userController.renderSignUpFrom );

// sign up submission
router.post("/signup", wrapAsync(userController.signUp));

// render login page
router.get("/login", userController.renderLogInForm);

// login page submission
router.post("/login",saveRedirectUrl ,passport.authenticate("local", {
    failureFlash : true,
    failureRedirect : "/login"
    }),
    userController.logIn);


// logout link
router.get("/logout",userController.logOut)

module.exports = router;
