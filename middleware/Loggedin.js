const Listing=require('../model/listing.js')
const Review=require('../model/reviews.js')
const ExpressError=require('../utils/ExpressError.js');
const{listingSchema,reviewSchema}=require('../schema.js')
// this middle check that the User has to be Lgged in Before Perform any Crud operation
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // track unlogged in user Store the api path to redirect or return to same page after logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash('error','you must be logged in to create listing!');
        res.redirect('/login')
    }
    next()
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        // track unlogged in user Store the api path to redirect or return to same page after logged in
        res.locals.redirectUrl = req.session.redirectUrl;
        
    }
    next();
}
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params; 
    let listing = await Listing.findById(id);
    if( res.locals.currUser &&!listing.owner.equals(res.locals.currUser._id)){
        req.flash('error',"you don't have permission!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}


// this function help to validate data come from server or req.body 
module.exports.listingValidate=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error) {
        let errmsg=error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
module.exports.reviewValidate=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error) {
        let errmsg=error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
module.exports.isreviewAuthor = async(req,res,next)=>{
    let { id,reviewId } = req.params; 
    let review = await Review.findById(reviewId);
    if( !review.author._id.equals(res.locals.currUser._id)){
        req.flash('error',"You not create this!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
