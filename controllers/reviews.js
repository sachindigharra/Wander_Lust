const Listing=require('../model/listing.js');
const Review=require('../model/reviews.js');

module.exports.createReview=async (req,res,next)=>{ 
    let listing = await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    console.log(newReview)
    listing.reviews.push(newReview);
    newReview.author=req.user._id;
    await newReview.save();
    await listing.save();
    req.flash('success','New Review Created ')
    res.redirect(`/listings/${listing._id}`);
};
module.exports.destroyReview=async (req,res,next)=>{
    let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash('success','Review Deleted')
        res.redirect(`/listings/${id}`);
};