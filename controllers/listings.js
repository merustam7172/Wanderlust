const Listing = require("../models/listing");
// const {listingTypes} = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");

// index route
module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

// new listing form
module.exports.renderNewForm = async(req,res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
}

// create listing
module.exports.createListing = async(req,res) => {
    let results = listingSchema.validate(req.body);
    if(results.error){
        throw new ExpressError(400, results.error);
    }
    // if(!req.body.listing){ // server side validation if listing is empty
    //     throw new ExpressError(400,"Send Valid listing data");
    // }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing); // ejs wala listing
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    console.log(originalImageUrl);
    originalImageUrl = originalImageUrl.replace("/upload","/upload/c_fill,h_200,w_200");
    res.render("listings/edit.ejs",{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res) => {
    let results = listingSchema.validate(req.body);
    if(results.error){
        throw new ExpressError(400, results.error);
    }
    // if(!req.body.listing){ // server side validation if listing is empty
    //     throw new ExpressError(400,"Send Valid listing data");
    // }
    let {id} = req.params;
    const updatedlisting = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedlisting.image = {url,filename};
        updatedlisting.save();
    }

    req.flash("success","Edited Successfully!");
    res.redirect(`/listings/${id}`);
}

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path : "reviews",
            populate : {
                path : "author",
            },
        })
        .populate("owner"); // models me listing schema wala review
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}

module.exports.deleteListing = async(req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}