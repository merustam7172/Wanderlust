const User = require("../models/user.js");

module.exports.renderSignUpFrom = (req,res) => {
    res.render("users/signup.ejs");
    
}

module.exports.signUp = async(req,res) => {
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {     // req.login for automatically login after signup
            if(err) {
            return next(err);
            }
            req.flash("success", `Hey! ${username} Welcome to Wanderlust`);
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
  
}

module.exports.renderLogInForm = (req,res) => {
    res.render("users/login.ejs");   
}

module.exports.logIn = async(req,res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    // console.log(redirectUrl);
    res.redirect(redirectUrl);

}

module.exports.logOut = (req,res,next)=> {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "You are successfully logged out!");
        res.redirect("/listings");
    });
}