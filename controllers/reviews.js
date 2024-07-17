
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.submitReview = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    // create new review
    let newReview = new Review(req.body.review);

        newReview.author = req.user._id;    // new review me author add kar do 
        await newReview.save();
        // append newReview to its listing
        listing.reviews.push(newReview);
        await listing.save();
        req.flash("success", "New Review added successfully");
        res.redirect(`/listings/${id}`);

}

module.exports.deleteReview = async(req,res) => {
    let {id, reviewId} = req.params;

    // listing me se review delete kar lo
    await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});  // pull operator reviews list me reviewId match kar jaye hm use pull kar lenge
    // review delete karlo
    await Review.findByIdAndDelete(id);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`)
}