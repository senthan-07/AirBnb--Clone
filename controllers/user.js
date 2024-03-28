const User = require("../models/user");

module.exports.RenderSignupForm = (req,res)=>{
    res.render('users/signup.ejs')
};

module.exports.signup = async (req,res)=>{
    try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await  User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{   //For automatic login
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wander Lust");
        res.redirect("/listing");
    });    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs');    
};

module.exports.login = async (req,res)=>{  //Passport .. authenticate is a middle ware which does authentication for us by checking and veifying password
    req.flash("success","Welcome back to wanderlust");
    let redirectUrl = req.session.redirectUrl ||"/listing";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{        //Call back function and while calling callback we store err in this 
        if(err){
            next(err);
        }
        req.flash("success","You are logged out");
        res.redirect("/login");
    })                 
};