const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review = require("./review.js");

// const listingTypes = ["trending","farms", "mountaing","pool","beach", "chef kitchen","boats","camping", "bed breakfast"];

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
    },
    image : {
        url : String,
        filename : String
    },
    price : {
       type : Number,
    },
    location : {
        type : String,
    },
    country : {
        type : String,
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review", // model name
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    },
   
});
// post Schema
listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
