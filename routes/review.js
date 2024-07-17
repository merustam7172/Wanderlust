const express = require("express");
const router = express.Router({mergeParams:true});

const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middlewear.js")


const reviewController = require("../controllers/reviews.js");




// reviews
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.submitReview));

// delete reviews
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
