const User=require('../model/user.js');
const Listing=require('../model/listing.js')
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
    //console.log(req.user.username)
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
module.exports.bookings=async (req,res)=>{
    if(req.user==undefined){
        return res.redirect('/login')
    }
    const user=req.user;

   const users= await User.findById(user.id).populate({path:'bookings'})
   
   
   if(users){
    
        return res.render('users/books.ejs',{users});
   }

        req.flash('error',"sorry! you havn't any bookins")
        res.redirect('/listings')
   
}
module.exports.booked=async(req,res,next)=>{
    if(req.user==undefined){
        return res.redirect('/login')
    }
    const user=req.user;
    let id=user._id;
    
   const users= await User.findById(id)
   let listing = await Listing.findById(req.params.id);
   
    users.bookings.push(listing);
    await users.save()
    req.flash('success','Hotel booked! thank You')
    res.redirect('/listings')
}
module.exports.deleteBooking=async(req,res,next)=>{
    if(req.user==undefined){
        return res.redirect('/login')
    }
    const user=req.user;
    let id=user._id;
    let listingId=req.params.id;
    console.log(listingId)
    let updateUser=await User.findByIdAndUpdate(id,{$pull:{bookings:listingId}});
    console.log(updateUser)
    req.flash('success','Booking Canceld!')
    res.redirect('/bookings')
}