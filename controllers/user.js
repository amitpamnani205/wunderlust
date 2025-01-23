const User = require("../models/user.js");


const renderSignup = async (req,res) => {
    res.render("users/signup.ejs")
};

const userSignup = async (req,res)=> {
    try{

   
    let {username,email,password} = req.body;
    const newUser = new User({username,email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser, (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wunderlust");
        res.redirect("/listings");
    });
  
}catch(e){
    req.flash("error", e.message);
    res.redirect("/signup")
}

};

const renderUserLogin = (req,res)=>{
    res.render("users/login.ejs");
};

const userLogin = async (req,res)=>{
    req.flash("success", "Welcome Back to Wunderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";  
    res.redirect(redirectUrl);
};

const userLogout = (req,res,next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "successfully logged out.");
        res.redirect("/listings");
    });
};

module.exports = { renderSignup,userSignup,renderUserLogin,userLogin,userLogout}