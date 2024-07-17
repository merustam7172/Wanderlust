if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
//const mongo_url = "mongodb://127.0.0.1:27017/Wanderlust";
const dbURL = "mongodb+srv://merustam7172:IIJhtaAlwoEYp3i8@cluster0.ci2jgfl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
// const wrapAsync = require("./utils/wrapAsync.js");
// const Listing = require("./models/listing.js");
// const {listingSchema,reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

//  require Restructuring routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main().then( () => {
    console.log("Connected to DB");
});
async function main() {
    await mongoose.connect(dbURL);
};

// mongo session
const store = MongoStore.create({
    mongoUrl : dbURL,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600
});

store.on("error", (err) => {
    console.log("ERROR IN MONGO SESSION STORE",err)
});

// express session for cokiee
const sessionOption = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.set("view engine", "ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true})); 
app.use(methodOverride("_method")) ; // use for update and delete route
app.engine("ejs",ejsMate); // use for boilerplate(layout)
app.use(express.static(path.join(__dirname, "/public")));

// flash middlewear
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
// use Restructuring routes
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email : "stu@gmail.com",
//         username: "alpha-student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })



app.get("/", (req,res) => {
    res.send("Hii i am root")
});


// Error handler middlewears
app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page not Found")); // throwing error
});

app.use((err,req,res,next) => {
    
    let {statusCode=500,message="Something went wrong "} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})
app.listen(8000, () => {
    console.log("Server is listining on port 8000");
});