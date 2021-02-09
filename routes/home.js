const express = require('express');
const db = require('../db');
const router = express.Router();

// Serves the home page which has the image upload form on it. If the user is an admin, moderator, or verified, the auth variable will be set to true, which will allow the user to upload images without solving a reCaptcha challenge.
router.get('/', (req, res) => {
    let auth = false;
    if (req.session){
        if (req.session.userInfo){
            if (req.session.userInfo.role === "Verified" || req.session.userInfo.role === "Janny" || req.session.userInfo.role === "Chadmin"){
                auth = true;
            }
        }
    }
    res.render('home', {
        user: (req.session.userInfo) ? req.session.userInfo.user : 0,
        auth: auth
    });
});

module.exports = router;