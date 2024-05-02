const User=require('../model/user.js');

module.exports.renderSignup=(req,res)=>{
    res.render('users/signup.ejs')
}
module.exports.Signup=async (req,res,next)=>{
    try {
     let{email,username,password} = req.body;
     const newUser = new User({email,username,password});
     let registeredUser= await User.register(newUser,password);
    //  Logged in New  User After Signup
     req.login(registeredUser,(err)=>{
             if(err){
                 next(err);
             }
             req.flash('success','Welcome to Wander Lust!');
             res.redirect('/listings');
         })
 
    } catch (error) {
     req.flash('error',error.message);
     res.redirect('/signup')
    }
}

module.exports.userLoginForm=(req,res)=>{
    res.render('users/login.ejs');
};

module.exports.Login=async(req,res)=>{
    req.flash('success','Welcome! back to WanderLust')
    // user directly logged in
    let redirectUrl=res.locals.redirectUrl || '/listings'
    res.redirect(redirectUrl);
};

module.exports.Logout=(req,res,next)=>{
    // Logout user using passport method
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash('success','you logged out!');
        res.redirect('/listings');
    })

};