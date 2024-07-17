const Listing  = require("./models/listing.js");
const Review  = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

// listing server side validaiton middlewears
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
};

// Review server side validation middlewars
module.exports.validateReview = async(req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        // req
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in for access this features!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl)
   { res.locals.redirectUrl = req.session.redirectUrl;}
   next();
}

// checking owner of listing
module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(res.locals.currUser && !res.locals.currUser._id.equals(listing.owner._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    const review = await Review.findById(reviewId)
    if(res.locals.currUser && !res.locals.currUser._id.equals(review.author._id)){
        req.flash("error","You are not the author of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}