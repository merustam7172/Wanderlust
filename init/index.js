const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";

main().then( () => {
    console.log("Connected to DB");
});
async function main() {
    await mongoose.connect(mongo_url);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({...obj, owner : "669365ac0e77927db9406507"}))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}
initDB();