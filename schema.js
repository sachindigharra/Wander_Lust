// These Schema Used to For server side Handling
const joi = require('joi');

//<---- Listing  Schema---->

module.exports.listingSchema= joi.object({
    listing:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().allow("",null),
        category:joi.string().allow("",null)
    }).required()
})


//<------ Review Schema ---->

module.exports.reviewSchema=joi.object({
    review:joi.object({
        comment:joi.string().required(),
        rating:joi.number().required().min(0).max(5),

    }).required()
})