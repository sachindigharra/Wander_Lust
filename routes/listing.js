const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const{listingValidate}= require('../middleware/Loggedin.js');
const{isLoggedIn} = require('../middleware/Loggedin.js');
const{isOwner} = require('../middleware/Loggedin.js')
const listingController = require('../controllers/listings.js');
const multer  = require('multer')
const {storage} = require('../cloundconfig.js');
const Listing = require('../model/listing.js');
const upload = multer({ storage})
// compact fashoin of Rotes
router
    .route('/')
    //Index Route
    .get(
        wrapAsync(listingController.index)
    )
    //Create Route
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        listingValidate,
        wrapAsync(listingController.createListing)
    );
    

// New route
router.get('/new',
    isLoggedIn,
    listingController.renderNewForm
)

//compacte routes
                router
                .route('/:id')
/*show*/        .get(wrapAsync(listingController.showListing))
/*update*/      .put(
                    isLoggedIn,
                    isOwner,
                    upload.single('listing[image]'),
                    listingValidate,
                    wrapAsync(listingController.editListing)
                )
/*Destroy */    .delete(
                    isOwner,
                    wrapAsync(listingController.destroyListing)
                );

// Edit route 

router.get('/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
)
// filter rotrer
router.get('/filter/:id',
    wrapAsync(listingController.filterListing)
)
router.post('/search',
    wrapAsync(listingController.searchDestination)
)
module.exports= router;