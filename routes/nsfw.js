/* These are the endpoints related to NSFW material. Images (not comments) can be marked NSFW. Users must confirm that 
they are over the age of 18 and willing to see potentially adult material if they choose to proceed. */


const express = require('express');
const router = express.Router();


// Serves the NSFW page
router.get('/', (req, res) => {
    res.render('nsfw');
})

router.get('/accept', (req, res) => {

    /* When a user is redirected to the NSFW page, their session will be updated with a "splash" page. This is the page 
    they were previously trying to go to when they were redirected to the NSFW page. When the user accepts the NSFW 
    agreement, they will be redirected to that page. If no such page exists, such as in cases where users decide to go 
    straight to nanaimg.net/nsfw, they will be redirected to the home page instead. */

    req.session.nsfw = true;
    if (req.session.splash === undefined){
        res.redirect('home');
    } else {
        res.redirect(req.session.splash);
    }
})

router.get('/decline', (req, res) => {

    // When a user declines to see NSFW content, they are redirected to the home page.

    req.session.nsfw = false;
    res.redirect('/');
})

module.exports = router;