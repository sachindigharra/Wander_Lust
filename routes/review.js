const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const{reviewValidate,isLoggedIn,isreviewAuthor} = require('../middleware/Loggedin.js');
const reviewControllers=require('../controllers/reviews.js');




// Reviews Route 
// <----Post route for review --->
router.post('/',
    reviewValidate,
    isLoggedIn,
    wrapAsync(reviewControllers.createReview)
);

//<----Review Delete --->
router.delete('/:reviewId',
    isLoggedIn,
    isreviewAuthor,
    wrapAsync(reviewControllers.destroyReview)
);

module.exports= router;