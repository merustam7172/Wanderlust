const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn,isOwner,validateListing} = require("../middlewear.js");
const listingControllers = require("../controllers/listings.js");
// FOR FILE PURPOSE

const multer  = require('multer');
const {storage,cloudinary} = require("../cloudConfig.js");
const upload = multer({storage});



// index route
router.get("/",wrapAsync(listingControllers.index));

// create route
router.get("/new",isLoggedIn,wrapAsync(listingControllers.renderNewForm));

router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing ,wrapAsync(listingControllers.createListing));
    // .post("/",upload.single("listing[image]"),(req,res) => {
    //     res.send(req.file);
    // })

// update route
router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingControllers.renderEditForm));

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing ,wrapAsync(listingControllers.updateListing));

// show route
router.get("/:id",wrapAsync(listingControllers.showListing))

// delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingControllers.deleteListing));

module.exports = router;
