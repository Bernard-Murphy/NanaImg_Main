const express = require('express');
const router = express.Router();


// The user is sent to the about page with his or her credentials
router.get('/', (req, res) => {
    try {
        res.render('about', {
            user: (req.session.userInfo) ? req.session.userInfo.user : 0
        });
    } catch (err) {
        res.sendStatus(500);
    }
    
})

module.exports = router;