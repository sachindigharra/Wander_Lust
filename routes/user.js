const express = require('express');
const router = express.Router();
const User = require('../model/user.js')
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require('passport')
const userControllers=require('../controllers/users.js')
const {saveRedirectUrl} = require('../middleware/Loggedin.js');

router
.route('/signup')
    //<---user get route-->
    .get(
        userControllers.renderSignup
    )
    //<-- user post route-->
    .post(
        wrapAsync(userControllers.Signup)
    );


//<---user Login Rotes-->

router
    .route('/login')

//<get login>
    .get(
        userControllers.userLoginForm
    )
//<post login>
    .post(saveRedirectUrl,
        passport.authenticate(
            'local', 
            { failureRedirect: '/login',failureFlash:true}
        ),
        userControllers.Login
    );
//<--- User Log Out-->
router.get('/logout',
    userControllers.Logout
)
router.get('/bookings',
        
    userControllers.bookings
)
router.post('/book/:id',
    userControllers.booked
)
router.put('/book/:id',
    userControllers.deleteBooking
)
module.exports=router;